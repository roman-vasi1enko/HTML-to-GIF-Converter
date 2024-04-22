module.exports = {
    // Define the location of the parent directory
    baseDir: '/Users/roman/Downloads/HPE-US, UK, Canada, Netherlands, India-Q2 banners-04.03.24',

    // Count how long (in seconds) does the actual banner takes to run one full loop and enter it here. If, the final GIF cuts too early - add a couple of seconds
    gifDuration: 12,

    // Number of frames per second
    frameRate: 18,

    // Time (in miliseconds) between each screenshot. Reduce to make GIF smoother (note that file size will increase)
    screenshotInterval: 5,

    // Quality of frames. 1 - highest, 30 - lowest quality
    gifQuality: 1,

    // Allow the GIF to loop infinitely (repeat) or stop when ended. -1: do not loop, 1: loop
    gifLoop: -1,

    // If the final GIF looks shifted outside its borders (viewport area), open the HTML banner in the browser and see if there are margin or padding styles applied to an element other than body. If so, replace the 'body' with the name of the element.
    // If it didn't work, try replacing with asterisk "*", this will remove margins from every element.
    resetOffset: 'body',
};
