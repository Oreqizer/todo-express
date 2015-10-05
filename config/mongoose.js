'use strict';

/**
 * Configuration of the Mongoose instance
 * @module Mongoose
 */

// Load main modules
const mongoose = require('mongoose');
const config = require('./config');

// Load helper modules
const wrench = require('wrench');

/**
 * Sets up the necessary configuration of Mongoose
 * @returns {Object} the Mongoose database instance
 */
module.exports = function() {

  const db = mongoose.connect(config.db);

  // Make Mongoose use the native promises
  mongoose.Promise = Promise;

  // Loads all models
  wrench
    .readdirSyncRecursive('./app')
    .filter(file => (/\.model\.js$/i).test(file))
    .map(file => {
      require(`../app/${file}`);
    });

  return db;

};
