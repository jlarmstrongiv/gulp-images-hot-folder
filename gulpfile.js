const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const del = require('del');
const zip = require('gulp-zip');

const imageResize = require('gulp-image-resize');
const parallel = require('concurrent-transform');
const os = require('os');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminGuetzli = require('imagemin-guetzli');
const responsive = require('gulp-responsive');

const DIST_PATH = 'dist';
const SRC_PATH = 'src';
const SVG_PATH = SRC_PATH + '/**/*.svg';
const RASTER_PATH = SRC_PATH + '/**/*.{jpg,jpeg,png,gif}';

const PACKAGE = 'images.zip';

const SIZES = [200, 400, 800, 1200, 1600, 2000, 2400];
const QUALITY = 70;

gulp.task('clean', () => {
  return del.sync([
    DIST_PATH,
    PACKAGE
  ])
});

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
           imageMagick: true,
           background: 'transparent',
           quality: 1
         })
      ))
      .pipe(rename((path) => {
        path.basename += '-' + size;
      }))
      .pipe(imagemin([
      	imagemin.gifsicle({interlaced: true}),
      	imageminMozjpeg({quality: QUALITY}),
      	pngquant({quality: QUALITY}),
        // imageminGuetzli({quality: QUALITY}),
      	imagemin.svgo()
      ]))
      .pipe(flatten())
      .pipe(plumber.stop())
      .pipe(gulp.dest(DIST_PATH))
  });
  resizeImageTasks.push(resizeImageTask);
});
gulp.task('resize-image-tasks', () => {
  gulp.start(resizeImageTasks);
});
gulp.task('r-once', ['clean'], () => {
  return gulp.start(['resize-image-tasks', 'svg']);
});
gulp.task('r-watch', ['once'], () => {
  watch(RASTER_PATH, () => {
    return gulp.start('resize-image-tasks');
  });
  watch(SVG_PATH, () => {
    return gulp.start('svg');
  });
});

let responsiveImageTasks = [];
SIZES.forEach(function(size) {
  let responsiveImageTask = 'responsive-' + size;
  let responsiveImageTaskSuffix = '-' + size;
  gulp.task(responsiveImageTask, function() {
    return gulp.src(RASTER_PATH)
      .pipe(plumber())
      .pipe(changed(DIST_PATH))
      .pipe(responsive({
        '**/*.*': [
          {
            width: size,
            quality: QUALITY,
            rename: {
              suffix: responsiveImageTaskSuffix
            }
          }
        ]
      }, {
        progressive: true,
        compressionLevel: 6,
        withMetadata: false,
        quality: 70,
        withoutEnlargement: true,
        skipOnEnlargement: false,
        errorOnEnlargement: false,
        // flatten: true
      }))
      .pipe(flatten())
      .pipe(plumber.stop())
      .pipe(gulp.dest(DIST_PATH))
  });
  responsiveImageTasks.push(responsiveImageTask);
});
gulp.task('responsive-image-tasks', () => {
  gulp.start(responsiveImageTasks);
});
gulp.task('once', ['clean'], () => {
  return gulp.start(['responsive-image-tasks', 'svg']);
});
gulp.task('watch', ['once'], () => {
  watch(RASTER_PATH, () => {
    return gulp.start('responsive-image-tasks');
  });
  watch(SVG_PATH, () => {
    return gulp.start('svg');
  });
});
// svgs
gulp.task('svg', () => {
  return gulp.src(SVG_PATH)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(plumber.stop())
});
// zip
gulp.task('package', ['once'], () => {
  return gulp.src(DIST_PATH)
    .pipe(plumber())
    .pipe(zip(PACKAGE))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./'))
});
// moves originals too
gulp.task('copy-raster', () => {
  return gulp.src(RASTER_PATH)
    .pipe(flatten())
    .pipe(gulp.dest(DIST_PATH));
});
gulp.task('once-originals', ['clean'], () => {
  gulp.start(['resize-image-tasks', 'copy-raster', 'svg']);
});
gulp.task('watch-originals', ['once-originals'], () => {
  watch(RASTER_PATH, () => {
    return gulp.start(['resize-image-tasks', 'copy-raster']);
  });
  watch(SVG_PATH, () => {
    return gulp.start('svg');
  });
});
