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

  // Authorize the user first if needed
  router.all(/users/, users.authorize);
  router.param('id', users.isOwner);

  // Find user by ID: search, update or remove
  router.get('/users/:id', users.find);
  router.put('/users/:id', users.update);
  router.delete('/users/:id', users.remove);

  // Login the requested user
  router.post('/login', users.login, users.token);

  // Register a new user
  router.post('/register', users.register);

  // Register the router
  app.use('/api', router);

};
