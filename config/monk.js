'use strict';

let monk = require('monk'),
    config = require('./config');

module.exports = function() {
  
  let db = monk(config.db);
  
  return db;
  
};

