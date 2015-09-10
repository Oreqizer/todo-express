'use strict';

// Get the 'users' collection
let db = require('../../config/monk')(),
    users = db.get('users');

// Error handler controller
//let errors = require('./errors.ctrl');
  
// API endpoints:
// Returns all users
exports.findAll = function(req, res) {
    
  users.find({})
  .then(data => {
    res.json(data);
  })
  .catch(err => {
//      errors.db(err);
  });

};
  
// Returns an user by ID
exports.find = function(req, res, next, id) {

  users.find(id)
  .then(user => {
    if (user !== {}) {
      req.user = user;
      next();
    } else {
      res.redirect('/users/notfound');
    }
  }, err => {
    next(err);
  });

};
  
// Logs in an user
exports.login = function(req, res) {



}
  
// Registers an user
exports.register = function(req, res) {



}
