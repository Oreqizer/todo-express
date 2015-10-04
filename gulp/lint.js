'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {

  // Lints .js files and gives a report
  gulp.task('lint', () => {

    gulp.src(options.app)
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.jshint())
      .pipe($.jscs())
      .pipe($.jscsStylish.combineWithHintResults())
      .pipe($.jshint.reporter('jshint-stylish'));

  });

};
