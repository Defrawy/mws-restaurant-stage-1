
var gulp = require('gulp');
// var sass = require('gulp-sass');
var autprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
 browserSync.init({
     server: "./"
 });
 browserSync.stream();

gulp.task('default', function () {
  console.log('hello, gulp');
});

// glup.task('styles', function() {
//   glup.src('sass/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(autoprefixer({
//       browsers: ['last 2 versions']
//     }))
//     .pipe(gulp.dest('/css'));
// });