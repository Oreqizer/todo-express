'use strict';

let gulp = require('gulp'),
    stylish = require('jshint-stylish');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {

  // Lints .js files and gives a report
  gulp.task('lint', () => {

    gulp.src([
      'app/**/*.js',
      'config/**/*.js',
      'public/**/*.js',
      'app.js'
    ])
      .pipe($.plumber())
      .pipe($.jshint())
      .pipe($.jscs())
      .pipe($.jscsStylish.combineWithHintResults())
      .pipe($.jshint.reporter('jshint-stylish'));

  });

};
