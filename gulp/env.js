'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();

module.exports = function(options) {

  // Sets the environment variables as needed
  gulp.task('env:dev', () => {

    $.env({
      vars: {
        NODE_ENV: 'development'
      }
    });

  });

  gulp.task('env:test', () => {

    $.env({
      vars: {
        NODE_ENV: 'test'
      }
    });

  });

};
