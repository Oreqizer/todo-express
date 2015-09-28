'use strict';

let gulp = require('gulp'),
    wrench = require('wrench');

let options = {

  public: 'public',
  tmp: 'public/.tmp',
  dist: 'public/dist',
  app: [
    'app/**/*.js',
    '!node_modules/**'
  ]

};

wrench
  .readdirSyncRecursive('./gulp')
  .filter(file => (/\.js$/i).test(file))
  .map(file => {
    require(`./gulp/${file}`)(options);
  });

gulp.task('default', () => {

  gulp.start('server');

});
