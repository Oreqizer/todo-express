'use strict';

// Get the 'users' collection
let db = require('../../config/monk'),
    users = db.get('users');

// Error handler controller
//let errors = require('./errors.ctrl');

module.exports = function() {
  
  // API endpoints:
  // Returns all users
  function findAll(req, res) {
    
    users.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
//      errors.db(err);
    });
    
  }
  
  // Returns an user by ID
  function find(req, res, next, id) {
    
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
    
  }
  
  // Logs in an user
  function login(req, res) {
    
    
    
  }
  
  // Registers an user
  function register(req, res) {
    
    
    
  }
  
};
