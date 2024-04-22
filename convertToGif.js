const {
    baseDir,
    gifDuration,
    frameRate,
    screenshotInterval,
    gifQuality,
    gifLoop,
    resetOffset,
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
// const getBannerFolders = async (dir) => {
//     let folders = [];
//     const files = await fs.promises.readdir(dir, { withFileTypes: true });
//     for (const file of files) {
//         if (file.isDirectory()) {
//             const subDir = path.join(dir, file.name);
//             folders.push(subDir); // Add directory to list
//             folders = folders.concat(await getBannerFolders(subDir)); // Recursively add subdirectories
//         }
//     }
//     return folders.filter((folder) =>
//         fs.existsSync(path.join(folder, 'index.html'))
//     ); // Only return folders that contain 'index.html'
// };
const getHtmlFiles = async (dir, fileList = []) => {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            await getHtmlFiles(filePath, fileList); // Recursively search in sub-directories
        } else if (file.name.endsWith('.html')) {
            fileList.push(filePath); // Add HTML file to list
        }
    }
    return fileList;
};

const captureScreenshots = async (page, htmlFilePath, width, height) => {
    const folderPath = path.dirname(htmlFilePath);
    const totalFrames = gifDuration * frameRate;
    
    await page.setViewport({ width, height });
    await page.goto(`file://${htmlFilePath}`);

    // Reset all margins to 0
    await page.evaluate((selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.margin = '0';
            el.style.padding = '0';
        });
    }, resetOffset);

    for (let i = 0; i < totalFrames; i++) {
        const frameNumber = String(i).padStart(5, '0');
        await page.screenshot({ path: path.join(folderPath, `frame${frameNumber}.png`) });
        await new Promise(resolve => setTimeout(resolve, screenshotInterval));
    }
};


const createGif = async (htmlFilePath, width, height) => {
    const encoder = new GIFEncoder(width, height);
    // Extract the directory where the HTML file is located
    const htmlFolder = path.dirname(htmlFilePath);
    // Determine the parent directory of the folder containing the HTML file
    const parentDirectory = path.dirname(htmlFolder);
    // Use the parent folder's name for the GIF file name
    const parentFolderName = path.basename(htmlFolder);
    // Construct the GIF file path to save it in the parent directory with the parent folder's name
    const gifPath = path.join(parentDirectory, `${parentFolderName}.gif`);

    console.log(`Creating GIF at ${gifPath}`);

    const delay = Math.round(1000 / frameRate) - 21; // Calculate the frame delay

    const stream = pngFileStream(`${htmlFolder}/frame*.png`)
        .pipe(encoder.createWriteStream({ repeat: gifLoop, delay, quality: gifQuality }))
        .pipe(fs.createWriteStream(gifPath));

    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            console.log(`GIF created successfully at: ${gifPath}`);
            deleteFrameFiles(htmlFolder); // Optionally delete the frame files after GIF creation
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
    const htmlFiles = await getHtmlFiles(baseDir);

    for (const htmlFilePath of htmlFiles) {
        // Extract folder name and dimensions from the HTML file's path or name
        const folderName = path.basename(path.dirname(htmlFilePath));
        const sizeMatch = folderName.match(/_FORMAT_(\d+)x(\d+)_/);

        if (sizeMatch) {
            const width = parseInt(sizeMatch[1], 10);
            const height = parseInt(sizeMatch[2], 10);
            console.log(`Processing: ${htmlFilePath} with size ${width}x${height}`);
            await captureScreenshots(page, htmlFilePath, width, height);
            await createGif(htmlFilePath, width, height)
                .then(() => {
                    deleteFrameFiles(path.dirname(htmlFilePath)); // Use the HTML file's directory path
                })
                .catch((error) => {
                    console.error('Failed to create GIF:', error);
                });
        }
    }

    await browser.close();
};

main().catch(console.error);
