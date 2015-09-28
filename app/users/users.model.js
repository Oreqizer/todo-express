'use strict';

/**
 * Contains user model schema, validators and normalizers
 * @namespace users
 * @module usersModel
 */

// Load modules
let crypt = require('../../utils/crypt');

// Load dependencies
let mongoose = require('mongoose'),
    v = require('validator'),
    _ = require('lodash');

// Load module builder
let Schema = mongoose.Schema;

/**
 * Defines the user model schema
 * @class
 */
let UserSchema = new Schema({

  username: {type: String, required: true, index: {unique: true}, match: /^\w+$/i},
  email: {type: String, required: true, index: {unique: true}, match: /.+@.+\.+/},
  password: {type: String, validate: passwordVal()},
  scope: {type: String, enum: ['owner', 'admin', 'user'], default: 'user'},
  firstName: {type: String, match: /^[a-zA-Z]+$/},
  lastName: {type: String, match: /^[a-zA-Z]+$/},
  webpage: {type: String, validate: urlVal()}

});

/**
 * [Mongoose pre-save] Normalizes names and hashes the password before saving a new user
 * @function normalize
 * @memberof module:usersModel~UserSchema
 * @this UserSchema
 *
 * @param {function} next - function that calls the next Mongoose middleware
 */
UserSchema.pre('save', function normalize(next) {

  this.firstName = _.capitalize(_.deburr(this.firstName).toLowerCase());
  this.lastName = _.capitalize(_.deburr(this.lastName).toLowerCase());

  //noinspection JSCheckFunctionSignatures
  crypt
    .hash(this.password)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => {
      next(err);
    });

});

/**
 * Checks if the submitted webpage url is valid
 * @function
 * @memberof module:usersModel~UserSchema
 * @returns {Array} [0] validation function, [1] error message
 */
function urlVal() {
  return [
    function(url) {
      return v.isURL(url);
    },
    'Invalid webpage url'
  ];
}

/**
 * Checks if the submitted password is long enough
 * @function
 * @memberof module:usersModel~UserSchema
 * @returns {Array} [0] validation function, [1] error message
 */
function passwordVal() {
  return [
    function(password) {
      return password.length >= 6;
    },
    'Password too short'
  ];
}

// Registers the new model
mongoose.model('User', UserSchema);
