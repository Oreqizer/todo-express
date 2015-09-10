'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {
  
  // Runs the server with 'nodemon', linting on every change
  gulp.task('server', ['env:dev'], () => {
    
    $.nodemon({
      script: 'app.js',
      ext: 'js json',
      tasks: ['lint']
    });
    
  });
  
};