'use strict';

/**
 * Contains user model schema, validators and normalizers
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

// Validation functions
let urlVal = [
  function checkURL(url) {
    return v.isURL(url);
  },
  'Invalid webpage url'
];

let passwordVal = [
  function checkPassword(password) {
    return password.length >= 6;
  },
  'Password too short'
];

/**
 * Defines the user model schema
 * @class
 */
let UserSchema = new Schema({

  username: {type: String, required: true, index: {unique: true}, match: /^\w+$/i},
  email: {type: String, required: true, index: {unique: true}, match: /.+\@.+\.+/},
  password: {type: String, validate: passwordVal},
  scope: {type: String, enum: ['owner', 'admin', 'user'], default: 'user'},
  firstName: {type: String, match: /^[a-zA-Z]+$/},
  lastName: {type: String, match: /^[a-zA-Z]+$/},
  webpage: {type: String, validate: urlVal}

});

/**
 * Normalizes names and hashes the password before saving a new user
 * @memberof module~UserSchema
 */
UserSchema.pre('save', function(next) {

  this.firstName = _.capitalize(_.deburr(this.firstName).toLowerCase());
  this.lastName = _.capitalize(_.deburr(this.lastName).toLowerCase());

  crypt.hash(this.password)
  .then(hash => {
    this.password = hash;
    next();
  })
  .catch(err => {
    next(err);
  });

});

/** Registers the new model */
mongoose.model('User', UserSchema);
