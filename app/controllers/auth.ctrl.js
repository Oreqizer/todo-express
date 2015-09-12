'use strict';

// Load security and helper modules
let bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    moment = require('moment');

// Load the necessary config
let config = require('../../config/config');

// Auth-related express middleware
exports.authorize = function(req, res, next) {
  
  
  
};

// Returns a valid JWT token
exports.token = function(req, res, next) {
  
  let expires = moment().add('days', 7).valueOf();
  let token = jwt.sign({
    iss: req.user._id,
    exp: expires
  }, config.secret);
  
  res.json({
    token,
    expires,
    user: req.user.toJSON()
  });
  
  next();
  
};

// ===== Utility functions =====
// Hashes the password
exports.hash = function(password) {
  
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  
};

// Checks the password
exports.checkPassword = function(requested, stored) {
  
  return new Promise((resolve, reject) => {
    bcrypt.compare(requested, stored, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
  
};
