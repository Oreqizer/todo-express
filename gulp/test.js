'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {

  // Runs all the tests and lint
  gulp.task('test', ['env:test', 'lint'], () => {

    gulp.src('app/**/*.spec.js')
      .pipe($.mocha());

  });

};
