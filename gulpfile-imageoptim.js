// OBSOLETE, use gulpfile.js
// --gulpfile gulpfile-imageoptim.js
const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const del = require('del');
const zip = require('gulp-zip');

const imageOptim = require('gulp-imageoptim');
const imageResize = require('gulp-image-resize');
const parallel = require('concurrent-transform');
const os = require('os');
const changed = require('gulp-changed');
const svgmin = require('gulp-svgmin');

const DIST_PATH = 'dist';
const SRC_PATH = 'src';
const SVG_PATH = SRC_PATH + '/**/*.svg';
const RASTER_PATH = SRC_PATH + '/**/*.{jpg,jpeg,png,tiff,gif}';

const PACKAGE = 'images.zip';

const SIZES = [200, 400, 800, 1200, 1600, 2000, 2400];

// run resize-200, for instance
// https://stackoverflow.com/questions/35801807/gulp-image-resize-to-generate-multiple-output-sizes
let resizeImageTasks = [];
SIZES.forEach(function(size) {
  let resizeImageTask = 'resize-' + size;
  gulp.task(resizeImageTask, function() {
    return gulp.src(RASTER_PATH)
      .pipe(plumber())
      .pipe(changed(DIST_PATH))
      .pipe(parallel(
        imageResize({
          // https://www.npmjs.com/package/gulp-image-resize
           width:  size,
           upscale: false,
           crop: false,
           quality: 1,
           noProfile: false,
           flatten: true,
         })
      ))
      .pipe(flatten())
      .pipe(gulp.dest(DIST_PATH))
      .pipe(rename((path) => {
        path.basename += '-' + size;
      }))
      .pipe(imageOptim.optimize({
        jpegmini: true, // false if not installed
        status: true // optimize summary in console
        //batchSize: 100
      }))
      .pipe(gulp.dest(DIST_PATH))
      .pipe(plumber.stop())
  });
  resizeImageTasks.push(resizeImageTask);
});

gulp.task('svg', () => {
  return gulp.src(SVG_PATH)
    .pipe(plumber())
    .pipe(svgmin()) // https://www.npmjs.com/package/gulp-svgmin
    .pipe(flatten())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(plumber.stop())
});

gulp.task('copy-raster', () => {
  return gulp.src(RASTER_PATH)
    .pipe(flatten())
    .pipe(gulp.dest(DIST_PATH));
});

gulp.task('clean', () => {
  return del.sync([
    DIST_PATH,
    PACKAGE
  ])
});

gulp.task('once', ['clean'], () => {
  gulp.start(resizeImageTasks);
});

gulp.task('watch', ['once'], () => {
  watch(RASTER_PATH, () => {
    gulp.start(resizeImageTasks);
  });
  watch(RASTER_PATH, () => {
    gulp.start('copy-raster');
  });
  watch(SVG_PATH, () => {
    gulp.start('svg');
  });
});

gulp.task('package', ['once'], () => {
  return gulp.src(DIST_PATH)
    .pipe(plumber())
    .pipe(zip(PACKAGE))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./'))
});
