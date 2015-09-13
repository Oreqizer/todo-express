'use strict';

let gulp = require('gulp'),
    stylish = require('jshint-stylish');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {
  
  // Lints .js files and gives a report
  gulp.task('lint', () => {
    
    gulp.src([
      'app/**/*.js',
      '!app/**/*.spec.js',
      'config/**/*.js',
      'public/**/*.js',
      'app.js'
    ])
      .pipe($.jshint())
      .pipe($.jshint.reporter(stylish));
    
  });
  
};