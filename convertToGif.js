const {
    baseDir,
    gifDuration,
    frameRate,
    screenshotInterval,
    gifQuality,
    gifLoop,
} = require('./config');
const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const fs = require('fs');
const path = require('path');

const deleteFrameFiles = (folderPath) => {
    const frameFiles = fs
        .readdirSync(folderPath)
        .filter((f) => f.startsWith('frame') && f.endsWith('.png'));
    console.log(`Deleting ${frameFiles.length} frame files in ${folderPath}`);
    frameFiles.forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.unlinkSync(filePath);
    });
};

// Function to get all banner folder paths recursively
const getBannerFolders = async (dir) => {
    let folders = [];
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            const subDir = path.join(dir, file.name);
            folders.push(subDir); // Add directory to list
            folders = folders.concat(await getBannerFolders(subDir)); // Recursively add subdirectories
        }
    }
    return folders.filter((folder) =>
        fs.existsSync(path.join(folder, 'index.html'))
    ); // Only return folders that contain 'index.html'
};

const captureScreenshots = async (page, folderPath, width, height) => {
    const totalFrames = gifDuration * frameRate; // Total number of frames based on duration and frame rate
    const frameDelay = Math.round(1000 / frameRate); // Delay in ms between frames to match the target frame rate

    await page.setViewport({ width, height });
    await page.goto(`file://${folderPath}/index.html`);

    for (let i = 0; i < totalFrames; i++) {
        const frameNumber = String(i).padStart(5, '0');
        await page.screenshot({
            path: path.join(folderPath, `frame${frameNumber}.png`),
        });
        await new Promise((resolve) => setTimeout(resolve, screenshotInterval));
    }
};

const createGif = async (folderPath, width, height) => {
    const encoder = new GIFEncoder(width, height);
    const folderName = path.basename(folderPath);
    const parentDirectory = path.dirname(folderPath);
    const gifPath = path.join(parentDirectory, `${folderName}.gif`);

    console.log(`Creating GIF at ${gifPath}`);

    const delay = Math.round(1000 / frameRate) - 21;

    const stream = pngFileStream(`${folderPath}/frame*.png`)
        .pipe(
            encoder.createWriteStream({
                repeat: gifLoop,
                delay: delay,
                quality: gifQuality,
            })
        )
        .pipe(fs.createWriteStream(gifPath));

    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            console.log(`GIF created successfully at: ${gifPath}`);
            resolve();
        });
        stream.on('error', (error) => {
            console.error(`Error creating GIF: ${error}`);
            reject(error);
        });
    });
};

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const bannerFolders = await getBannerFolders(baseDir);

    for (const folder of bannerFolders) {
        const folderName = path.basename(folder);
        const sizeMatch = folderName.match(/_FORMAT_(\d+)x(\d+)_/);
        if (sizeMatch) {
            const width = parseInt(sizeMatch[1], 10);
            const height = parseInt(sizeMatch[2], 10);
            console.log(
                `Processing: ${folderName} with size ${width}x${height}`
            );
            await captureScreenshots(page, folder, width, height);
            await createGif(folder, width, height)
                .then(() => {
                    deleteFrameFiles(folder); // Now delete frame files
                })
                .catch((error) => {
                    console.error('Failed to create GIF:', error);
                });
        }
    }

    await browser.close();
};

main().catch(console.error);
