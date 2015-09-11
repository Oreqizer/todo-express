'use strict';

// Get the 'users' collection
let db = require('../../config/monk')(),
    users = db.get('users');

// Helper modules
let v = require('validator'),
    _ = require('lodash');

// Auth module
let auth = require('./auth.ctrl');

// ==== API functions =====
// Returns all users
exports.findAll = function(req, res, next) {
    
  users.find({})
  .then(data => {
    res.json(data);
  }, err => {
    catchMongoErrors(err, next);
  });

};
  
// Returns a user by 'username'
exports.find = function(req, res, next) {

  users.findOne({
    name: req.params.username
  })
  .then(data => {
    res.json(data);
  }, err => {
    catchMongoErrors(err, next);
  });

};
  
// Logs in a user
exports.login = function(req, res) {



};
  
// Registers a user
exports.register = function(req, res, next) {
  
  users.insert(req.body)
  .then(data => {
    res.send(data);
    next();
  }, err => {
    catchMongoErrors(err, next);
  });

};
  
// Updates the user info
exports.update = function(req, res) {



};
  
// Deletes a user
exports.delete = function(req, res) {



};

// ===== Helper functions =====
// Checks if all required fields are filled in
exports.validate = function(req, res, next) {
  
  // Required fields
  let message = [];
  if (!req.body.username ||
      !req.body.email ||
      !req.body.password) {
    message.push('Missing required fields');
  }
  
  // Format errors and normalization
  if (req.body.password && req.body.password.length < 6) {
    message.push('Password too short');
  } else {
    req.body.salt = auth.salt();
    req.body.password = auth.hash(req.body);
  }
  
  if (req.body.email && !v.isEmail(req.body.email))
    message.push('Wrong email format');
  
  if (req.body.username && v.matches(req.body.username, /\W+/i))
    message.push('Invalid username');
  
  if (req.body.firstName) {
    req.body.firstName = _.capitalize(_.deburr(req.body.firstName).toLowerCase());
    if (v.matches(req.body.firstName, /[^A-z]/i)) 
      message.push('Invalid first name format');
  }
  
  if (req.body.lastName) {
    req.body.lastName = _.capitalize(_.deburr(req.body.lastName).toLowerCase());
    if (v.matches(req.body.lastName, /[^A-z]/i)) 
      message.push('Invalid last name format');
  }
  
  if (req.body.webpage && !v.isURL(req.body.webpage))
    message.push('Invalid webpage URL');
  
  // Error out if error messages found
  if (message.length > 0) {
    let err = new Error();
    err.message = message;
    return next(err);
  }

  next();
  
};

function catchMongoErrors(err, next) {
  
  var message = '';
  
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username or email already taken';
        break;
      default:
        message = 'Database error';
    }
  } else {
    message = 'Database error';
  }
  
  err.message = message;
  next(err);
  
}
