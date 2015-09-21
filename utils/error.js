'use strict';

/**
 * Utility module for easier error handling across the app
 * @module error
 */

/**
 * Creates an error with required parameters to be sent back to the client
 * @param   {Number} code    - the status code of the error
 * @param   {String} message - brief description of the error
 * @returns {Error}  the created error
 */
exports.error = function(code, message) {
  let err = new Error(message);
  err.status = code;
  return err;
};

/**
 * Handles errors specific to MongoDB
 * @param   {Object} err - the thrown error
 * @returns {Error}  the same error with additional information
 */
exports.mongoError = function(err) {

  err.status = 409;

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        err.message = 'Username or email already taken';
        break;
      default:
        err.message = 'Database error';
    }
  } else {
    err.message = err.toString();
  }

  return err;

};
