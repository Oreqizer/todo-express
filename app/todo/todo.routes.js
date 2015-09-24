'use strict';

/**
 * Contains all the routes for user manipulation
 * @namespace todo
 * @module todoRouter
 */

// Load modules
let todo = require('./todo.ctrl'),
    users = require('../users/users.ctrl');

// Load Express router
let router = require('express').Router();

/**
 * Applies all todo related routes to the app
 * @param {Object} app - the Express app instance
 */
module.exports = function(app) {

  // Authorize the user first
  router.all(/\/todos/, users.authorize);

  // Find todos
  router.get('/todos', todo.findAll);
  router.get('/todos/:id', todo.getTodo, todo.find);

  // Find todo by ID: update or delete
  router.put('/todos/:id', todo.getTodo, todo.update);
  router.delete('/todos/:id', todo.getTodo, todo.delete);

  // Post a new todo
  router.post('/todos', todo.post);

  // Register the router
  app.use('/api', router);

};
