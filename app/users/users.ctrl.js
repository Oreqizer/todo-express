'use strict';

/**
 * Contains all the functions for direct user manipulation
 * @namespace users
 * @module usersCtrl
 */

// Load modules
let config = require('../../config/config'),
    crypt = require('../../utils/crypt'),
    e = require('../../utils/error');

// Load dependencies
let jwt = require('jsonwebtoken'),
    moment = require('moment'),
    v = require('validator'),
    _ = require('lodash');

// Load models
let User = require('mongoose').model('User');

/**
 * [Middleware] Finds all users in the database
 * @param {Object}   req  - http request object
 * @param {Object}   res  - http response object
 * @param {Function} next - invokes next middleware
 */
module.exports.findAll = function(req, res, next) {

  User.find({})
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Returns a user by ID
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.find = function(req, res, next) {

  User.findById(req.params.id)
  .then(user => {
    if (!user) {
      return next(e.error(404, 'User not found'));
    }
    res.json(user);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Updated the user info
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.update = function(req, res, next) {

  User.findByIdAndUpdate(req.params.id, {
    $set: req.body.user
  }, {
    new: true
  })
  .then(user => {
    if (!user) {
      return next(e.error(404, 'User not found'));
    }
    res.json(user);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Deletes a user
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.delete = function(req, res, next) {

  User.findByIdAndRemove(req.params.id)
  .then(user => {
    if (!user) {
      return next(e.error(404, 'User not found'));
    }
    res.status(204).send('User deleted');
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Logs in a user
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.login = function(req, res, next) {

  User.findOne({
    // Searches both the username and email
    $or: [
      {username: req.body.username},
      {email: req.body.email}
    ]
  })
  .then(user => {
    // No user found
    if (!user) {
      return next(e.error(404, 'User not found'));
    }
    req.user = user;
    return crypt.checkPassword(req.body.password, user.password);
  })
  .then(match => {
    // Invalid password
    if (!match) {
      return next(e.error(401, 'Invalid password'));
    }
    next();
  })
  .catch(err => {
    next(err);
  });

};

/**
 * [Middleware] Registers a new user
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.register = function(req, res, next) {

  let user = new User(req.body);

  user.save()
  .then(user => {
    res.status(201).send(user);
    next();
  })
  .catch(err => {
    next(e.mongoError(err));
  });

};

/**
 * [Middleware] Checks incoming request's token
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.authorize = function(req, res, next) {

  let token = req.body.token;
  if (!token) {
    return next(e.error(401, 'No access token found'));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch (err) {
    next(err);
  }

  if (decoded.exp < Date.now()) {
    return next(e.error(401, 'Access token expired'));
  }
  req.body.iss = decoded.iss;

  next();

};

/**
 * [Middleware] Checks if the token's ID matches request ID
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 * @returns {Function} prematurely ends the function if an error occurs
 */
module.exports.isOwner = function(req, res, next) {

  if (req.body.iss !== req.params.id) {
    return next(e.error(401, 'Token and request ID mismatch'));
  }

  next();

};

/**
 * [Middleware] Returns a valid JWT token
 * @param   {Object}   req  - http request object
 * @param   {Object}   res  - http response object
 * @param   {Function} next - invokes next middleware
 */
module.exports.token = function(req, res, next) {

  let expires = moment().add(7, 'days').valueOf();
  let token = jwt.sign({
    iss: req.user._id,
    exp: expires
  }, config.secret);

  res.json({
    token,
    expires,
    user: req.user.toJSON()
  });

  next();

};
