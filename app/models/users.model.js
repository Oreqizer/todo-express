'use strict';

// Load the modelling module
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Helper modules:
let v = require('validator'),
    _ = require('lodash');

// Security module
let auth = require('../controllers/auth.ctrl');

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

// Schema definition
let UserSchema = new Schema({
  
  username: { type: String, required: true, index: { unique: true }, match: /^\w+$/i },
  email: { type: String, required: true, index: { unique: true }, match: /.+\@.+\.+/ },
  password: { type: String, validate: passwordVal },
  scope: { type: String, enum: ['owner', 'admin', 'user'], default: 'user' },
  firstName: { type: String, match: /^[a-zA-Z]+$/ },
  lastName: { type: String, match: /^[a-zA-Z]+$/ },
  webpage: { type: String, validate: urlVal }
  
});

// Pre-save data manipulation
UserSchema.pre('save', function(next) {
  
  this.firstName = _.capitalize(_.deburr(this.firstName).toLowerCase());
  this.lastName = _.capitalize(_.deburr(this.lastName).toLowerCase());
  
  auth.hash(this.password)
  .then(hash => {
    this.password = hash;
    next();
  })
  .catch(err => {
    next(err);
  });
  
});

// Register the model
mongoose.model('User', UserSchema);