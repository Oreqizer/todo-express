'use strict';

/**
 * Configuration of the Mongoose instance
 * @module Mongoose
 */

// Load main modules
let mongoose = require('mongoose'),
    config = require('./config');

// Load helper modules
let wrench = require('wrench');

/**
 * Sets up the necessary configuration of Mongoose
 * @returns {Object} the Mongoose database instance
 */
module.exports = function() {

  let db = mongoose.connect(config.db);

  // Loads all models
  wrench.readdirSyncRecursive('./app')
  .filter(file => (/\.model\.js$/i).test(file))
  .map(file => {
    require(`../app/${file}`);
  });

  return db;

};
