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

module.exports = {
  findAll,
  find,
  update,
  remove,
  post,
  getTodo
};

/**
 * [Middleware] Finds all todos of a user
 * @module todoCtrl
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
function findAll(req, res, next) {

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

}

/**
 * [Middleware] Returns a todo
 * @module todoCtrl
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
function find(req, res, next) {

  Todo.findById(req.params.id)
  .then(todo => {
    res.json(todo);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

}

/**
 * [Middleware] Updates a todo
 * @module todoCtrl
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
function update(req, res, next) {

  Todo.findByIdAndUpdate(req.params.id, {
    $set: req.body.todo
  }, {
    'new': true
  })
  .then(todo => {
    res.json(todo);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

}

/**
 * [Middleware] Deletes a todo
 * @module todoCtrl
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
function remove(req, res, next) {

  Todo.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).send('Todo deleted');
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

}

/**
 * [Middleware] Posts a new todo
 * @module todoCtrl
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
function post(req, res, next) {

  let todo = new Todo(req.body.todo);

  todo.save()
  .then(data => {
    res.status(201).send(data);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

}

/**
 * [Middleware] Gets the requested todo and checks if it belongs to the user
 * @module todoCtrl
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
function getTodo(req, res, next) {

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

}
