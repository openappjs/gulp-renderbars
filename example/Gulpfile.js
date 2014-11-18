var gulp = require('gulp');
var connect = require('gulp-connect');
var cache = require('gulp-cache');
var renderbars = require('../');

var data = {
  title: "Lorem ipsum dolor sit amet",
  author: "Frindle Babbin",
  content: "This is a post",
};

gulp.task('connect', function () {
  connect.server({
    root: "build",
    livereload: true,
  });
});

gulp.task('html', function () {
  gulp.src('./templates/*')
    .pipe(renderbars({
      base: 'templates',
      data: data,
    }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('default', ['html', 'connect']);
