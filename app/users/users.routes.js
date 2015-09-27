'use strict';

/**
 * Contains all the routes for user manipulation
 * @namespace users
 * @module usersRouter
 */

// Load modules
let users = require('./users.ctrl');

// Load Express router
let router = require('express').Router();

/**
 * Applies all user related routes to the app
 * @param {Object} app - the Express app instance
 */
module.exports = function(app) {

  // Find all users
  router.get('/users', users.findAll);

  // Find user by ID: search, update or remove
  router.get('/users/:id', users.find);
  router.put('/users/:id', users.authorize, users.isOwner, users.update);
  router.delete('/users/:id', users.authorize, users.isOwner, users.remove);

  // Login the requested user
  router.post('/login', users.login, users.token);

  // Register a new user
  router.post('/register', users.register);

  // Register the router
  app.use('/api', router);

};
