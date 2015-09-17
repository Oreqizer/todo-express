'use strict';

// Load main modules
let mongoose = require('mongoose'),
    config = require('./config');

// Load helper modules
let wrench = require('wrench');

module.exports = function() {

  let db = mongoose.connect(config.db);

  // Load all models
  wrench.readdirSyncRecursive('./app')
  .filter(file => (/\.model\.js$/i).test(file))
  .map(file => {
    require(`../app/${file}`);
  });

  return db;

};
