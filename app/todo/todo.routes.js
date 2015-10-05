'use strict';

/**
 * Contains all the routes for user manipulation
 * @namespace todo
 * @module todoRouter
 */

// Load modules
const todo = require('./todo.ctrl');
const users = require('../users/users.ctrl');

// Load Express router
const router = require('express').Router();

/**
 * Applies all todo related routes to the app
 * @param {Object} app - the Express app instance
 */
module.exports = function(app) {

  // Authorize the user first
  router.all(/todos/, users.authorize);
  router.param('id', todo.getTodo);

  // Find todos
  router.get('/todos', todo.findAll);
  router.get('/todos/:id', todo.find);

  // Find todo by ID: update or remove
  router.put('/todos/:id', todo.update);
  router.delete('/todos/:id', todo.remove);

  // Post a new todo
  router.post('/todos', todo.post);

  // Register the router
  app.use('/api', router);

};
