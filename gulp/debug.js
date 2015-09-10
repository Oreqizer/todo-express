'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {
  
  // Starts the server, also with node inspector
  // Visit: http://localhost:8080/debug?port=5858
  gulp.task('debug', ['env:dev', 'lint', 'server'], () => {
    
    return gulp.src([])
      .pipe($.nodeInspector());
    
  });
  
};