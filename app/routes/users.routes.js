'use strict';

// Express router
let router = require('express').Router();

// 'users' controller containing functions
let users = require('../controllers/users.ctrl');

module.exports = function(app) {
  
  // Find all users
  router.get('/users', users.findAll);

  // Find/remove user by ID
  router.get('/users/:user_id', users.find);
  router.delete('/users/:user_id', users.delete);

  // Login the requested user
  router.post('/login', users.login);

  // Register a new user
  router.post('/register', users.register);
  
  app.param('user_id', users.find);
  app.use('/api', router);
  
};