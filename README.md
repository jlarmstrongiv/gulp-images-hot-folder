# Image Resizer with Gulp.js

This project is a sample image resizer with gulp.js.  The gulpfile.js uses imagemin to compress the photos.  Feel free to edit the `const SIZES = [200, 400]` to add or remove variations, or the `const QUALITY = 70` to change the quality and subsequently their file sizes.  

## Installation

To open this project, ensure that you have node.js [installed](https://github.com/creationix/nvm), and run the following commands in your terminal:  

1. `git clone https://github.com/jlarmstrongiv/gulp-images-hot-folder`
2. `cd gulp-images-hot-folder`
3. `npm install`
4. `gulp watch`

## Other

The `src` folder is a “hot” folder, which means anything dragged into it will be automagically resized.  

Other available commands:

- `gulp clean`:  deletes the dist folder
- `gulp once`:  runs gulp clean and processes the images
- `gulp export`:  packages the dist folder into a zip file

That’s about it.  Hope you have a nice day! :)
