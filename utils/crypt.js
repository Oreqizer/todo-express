'use strict';

/**
 * Utility module that wraps functions of the bcrypt module
 * @module crypt
 */

// Load dependencies
let bcrypt = require('bcrypt');

/**
 * Hashes the password
 * @param   {String} password - a user's password
 * @returns {Promise} hashed password
 */
module.exports.hash = function(password) {

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

};

/**
 * Checks if the password matches the hash
 * @param   {String}  requested - the password to check
 * @param   {String}  stored    - the refference hash
 * @returns {Promise} password equals hash
 */
module.exports.checkPassword = function(requested, stored) {

  return new Promise((resolve, reject) => {
    bcrypt.compare(requested, stored, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });

};
