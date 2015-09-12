'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {
  
  // Runs the server with 'nodemon', linting on every change
  gulp.task('server', ['env:dev', 'lint'], () => {
    
    $.nodemon({
      script: 'app.js',
      ext: 'js json',
      tasks: ['lint']
    });
    
  });
  
  // Runs 'nodemon' with the debug flag
  gulp.task('server:debug', ['env:dev'], () => {
    
    $.nodemon({
      script: 'app.js',
      ext: 'js json',
      tasks: ['lint'],
      execMap: {
        js: "node --debug"
      }
    });
    
  });
  
};