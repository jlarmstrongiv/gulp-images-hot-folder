# Image Resizer with Gulp.js

This project is a sample image resizer with gulp.js.  The gulpfile.js uses ~~gulp-image resize and gulp-imagemin~~ gulp-responsive and sharp to compress the photos.  Feel free to edit the `const SIZES = [200, 400]` to add or remove variations, or the `const QUALITY = 70` to change the quality and subsequently their file sizes.  

## Installation

To open this project, ensure that you have the following dependencies installed:

- [homebrew](https://brew.sh/)
- brew install node (or install with [nvm](https://github.com/creationix/nvm))
- brew install imagemagick
- brew install graphicsmagick

Run the following commands in your terminal:  

1. `git clone https://github.com/jlarmstrongiv/gulp-images-hot-folder`
2. `cd gulp-images-hot-folder`
3. `npm install`
4. `gulp watch`

## Other

The `src` folder is a “hot” folder, which means anything dragged into it will be automagically resized.  

Other available commands:

- `gulp clean`:  deletes the dist folder
- `gulp once`:  runs gulp clean and processes the images
- `gulp watch`:  runs gulp once every time a file changes
- `gulp export`:  packages the dist folder into a zip file

Deprecated commands:

- `r-once`:  uses the imagemin algorithms to compress images
- `r-watch`:  uses the imagemin algorithms to compress images

That’s about it.  Hope you have a nice day! :)
