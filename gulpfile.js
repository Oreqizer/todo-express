'use strict';

let gulp = require('gulp'),
    wrench = require('wrench');

let options = {
  tmp: '.tmp',
  public: 'public',
  dist: 'public/dist',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red(`[${title}]`), err.toString());
      this.emit('end');
    };
  }
};

wrench.readdirSyncRecursive('./gulp')
  .filter(file => (/\.js$/i).test(file))
  .map(file => {
    require(`./gulp/${file}`)(options);
  });

gulp.task('default', () => {
  gulp.start('server');
});