'use strict';

// Express router
let router = require('express').Router();

// 'users' and 'auth' controllers needed for user auth and manipulation
let users = require('../controllers/users.ctrl'),
    auth = require('../controllers/auth.ctrl');

module.exports = function(app) {
  
  // Find all users
  router.get('/users', users.findAll);

  // Find user by ID: search, update or delete
  router.get('/users/:username', users.find);
  router.put('/users/:username', users.update);
  router.delete('/users/:username', users.delete);

  // Login the requested user
  router.post('/login', users.login, auth.token);

  // Register a new user
  router.post('/register', users.register);
  
  // Register the router
  app.use('/api', router);
  
};