'use strict';

let mongoose = require('mongoose'),
    config = require('./config');

module.exports = function() {
  
  let db = mongoose.connect(config.db);
  
  require('../app/models/users.model');
  
  return db;
  
};

