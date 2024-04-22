# HTML to GIF animated banner conversion tool

HTML to GIF Converter is a straightforward tool designed to help you turn HTML animations and banners into GIFs. This tool is for anyone who needs to convert web animations into a more compatible and widely supported format, making it easier to share and display your work across different platforms.

**What This Tool Does:**

- **Converts HTML to GIF**: It takes your HTML animations and turns them into GIFs, a format that can be viewed almost anywhere.
- **Preserves Your Animation**: The conversion process aims to keep the original look and feel of your animation as much as possible.
- **Lets You Set GIF Length**: You can decide how long the resulting GIF should loop, giving you control over the final product.
- **Flexible Sharing**: Once your HTML is converted to a GIF, you can use it in emails, on websites, or social media without worrying about compatibility issues.

## Installation Guide

### Step 1: Install Node.js

Node.js is required to run our tool. Follow the instructions below for your operating system.

#### Windows Users

1. Go to the Node.js download page.
2. Click on "Windows Installer".
3. Once downloaded, run the installer and follow the on-screen instructions, accepting the default settings.

#### Mac Users

1. Go to the Node.js download page.
2. Click on "macOS Installer".
3. After downloading, open the .pkg file and follow the setup wizard to install Node.js.

## Step 2: Download the Tool

1. Download this repository by clicking the green "<> Code" button on top of the page, then "Download ZIP"
2. Unzip the file to a folder of your choice on your computer.

## Step 3: Install the Tool

1. [Install the VSCode](https://code.visualstudio.com/) code editor and open it.
2. Drag and drop the repository folder you just unzipped to the VSCode window.
3. Open the Terminal in VSCode: (top bar menu) Terminal > New Terminal or View > Terminal menu commands.
4. Make sure the terminal is at the repository's folder location:
   1. Example: `username@Romans-MacBook-Air HTML-to-GIF-Converter-main %`
5. Type `npm install` and press Enter. This command installs all necessary dependencies.
   1. If you are experiencing errors during installation, most likely, there is an incompatibility with your computer software or hardware. Try copying full logs of the error from the Terminal and ask ChatGPT or another AI model to help you fix it.

## Step 4: Run the Tool

- With the setup complete, you're now ready to use the tool. Specific instructions to run the tool will vary depending on its implementation. Generally, you would start the tool using a command like `npm start` or `node app.js` from the Terminal or Command Prompt in the tool's folder.

Congratulations! You've successfully set up the GIF Creation Tool. For usage instructions, please refer to the specific commands and options provided in the tool's guide below.

## Usage Guide

1. Place separate banner folders containing `index.html` and the rest of the files into a separate group folder.
   1. Example 1: `Group Folder 1 > Single Banner Folder 1 > index.html`
   2. Example 2: `Group Folder 1 > Sub-group Folder 1 > Single Banner Folder 1 > index.html`
2. The script will pick up the size of the final banner based on the name of the folder with `index.html` (Single Banner Folder 1, from the previous example). To make sure it does that correctly, rename your folders to include the text in the following format: `FORMAT_WIDTHxHEIGHT_...` anywhere in the name.
   1. Example: `FY24_Q2_CampaignPage_TopAIModels_ProgrammaticAIPowered_BAN_970x250_JA` - the script will look for 970x250 between "BAN_" and following "_" that is right before "JA".
3. Copy the path to a group folder ("Group Folder 1").
   1. Windows: Hold Shift and right-click the group folder, then select "Copy as Path" from the context menu
   2. Mac: Hold Option (⌥) and right-click the group folder > click "Copy 'folder_name' as Pathname" from the context menu
   3. Example: '/Users/roman/Downloads/TopAIModels'
4. Open the `config.js` file and paste the folder's path into the `baseDir` variable inside quotes.
   1. `const baseDir = 'PASTE_HERE';`
5. Adjust the `config.js` settings. Follow the instructions provided inside.
6. Save the changes you've made in the `config.js` file.
7. Open the "convertToGif.js" file and click "Run Code" ("Play" button on the top right corner of VSCode).
8. The GIF files will be created and saved in the "Group Folder 1" folder along with folders containing the `index.html` file.

### Notes

1. You can start checking GIFs as soon as the script logs "GIF created successfully at: ...".
2. If you need to make adjustments in the `config.js` file, stop the script at any moment. You don't have to wait until it finishes.
3. If you need to reduce the size of the GIF, but don't want to mess with the quality configurations - use the [ImageOptim](https://imageoptim.com/) app. It is fast, free, and provides great results.
4. Sometimes HTML banners are built with extra style rules positioning the banner container a few pixels away from browser borders. By default, the script will reset the banner's `body` element styles (margin & padding). If the styles are applied to a different element, copy the CSS selector of that element using your browser's inspect tool and replace the `resetOffset` variable in the `config.js` file.
