'use strict';

// Get the User model
let User = require('mongoose').model('User');

// Helper modules
let v = require('validator'),
    _ = require('lodash');

// Auth module
let auth = require('./auth.ctrl');

// ==== API functions =====
// Returns all user
exports.findAll = function(req, res, next) {
    
  User.find({})
  .then(data => {
    res.json(data);
  }, err => {
    mongoErrors(err, next);
  });

};
  
// Returns a user by 'username'
exports.find = function(req, res, next) {

  User.findOne({
    username: req.params.username
  })
  .then(user => {
    if (!user) userNotFound(next);
    res.json(user);
  }, err => {
    mongoErrors(err, next);
  });

};
  
// Logs in a user
exports.login = function(req, res, next) {
  
  User.findOne({
    // Searches both the username and email
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  })
  .then(user => {
    // No user found
    if (!user)
      userNotFound(next);
    req.user = user;
    return auth.checkPassword(req.body.password, user.password);
  })
  .then(match => {
    // Invalid password
    if (!match)
      userNotAuthorized('Invalid password', next);
    next();
  }, err => {
    mongoErrors(err, next);
  });

};
  
// Registers a user
exports.register = function(req, res, next) {
  
  let user = new User(req.body);
  
  user.save()
  .then(data => {
    res.send(data);
    next();
  }, err => {
    mongoErrors(err, next);
  });

};
  
// Updates the user info
exports.update = function(req, res) {



};
  
// Deletes a user
exports.delete = function(req, res) {



};

// ===== Error functions =====
function mongoErrors(err, next) {
  
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
    message = err.toString();
  }
  
  err.message = message;
  next(err);
  
}

function userNotFound(next) {
  
  let err = new Error();
  err.message = 'User not found';
  err.status = 404;
  return next(err);
  
}

function userNotAuthorized(message, next) {
  
  let err = new Error();
  err.message = message;
  err.status = 401;
  return next(err);
  
}