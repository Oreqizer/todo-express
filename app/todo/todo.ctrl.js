'use strict';

/**
 * Contains all the functions for direct todo manipulation
 * @namespace todo
 * @module todoCtrl
 */

// Load modules
let e = require('../../utils/error');

// Load models
let Todo = require('mongoose').model('Todo');

/**
 * [Middleware] Finds all todos of a user
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
module.exports.findAll = function(req, res, next) {

  Todo.find({
    _owner: req.body.iss
  })
  .then(data => {
    res.json(data);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Returns a todo
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
module.exports.find = function(req, res, next) {

  Todo.findById(req.params.id)
  .then(todo => {
    res.json(todo);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Updates a todo
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
module.exports.update = function(req, res, next) {

  Todo.findByIdAndUpdate(req.params.id, {
    $set: req.body.todo
  }, {
    new: true
  })
  .then(todo => {
    res.json(todo);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Deletes a todo
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
module.exports.delete = function(req, res, next) {

  Todo.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).send('Todo deleted');
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Posts a new todo
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
module.exports.post = function(req, res, next) {

  let todo = new Todo(req.body.todo);

  todo.save()
  .then(data => {
    res.status(201).send(data);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Gets the requested todo and checks if it belongs to the user
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.getTodo = function(req, res, next) {

  Todo.findById(req.params.id)
  .then(todo => {
    if (!todo) {
      return next(e.error(404, 'Todo not found'));
    }
    if (req.body.iss !== todo._owner) {
      return next(e.error(401, 'Todo does not belong to user'));
    }
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};
