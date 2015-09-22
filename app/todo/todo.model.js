'use strict';

/**
 * Contains user model schema, validators and normalizers
 * @namespace todo
 * @module todoModel
 */

// Load dependencies
let mongoose = require('mongoose'),
    v = require('validator'),
    _ = require('lodash');

// Load module builder
let Schema = mongoose.Schema;

/**
 * Defines the todo model schema
 * @class
 */
let TodoSchema = new Schema({

  title: {type: String, required: true, index: true},
  content: {type: String},
  importance: {type: String, enum: ['weak', 'neutral', 'strong'], default: 'neutral'},
  created: {type: Date, default: Date.now},
  _owner: {type: Schema.ObjectId, ref: 'User', index: true}

});

// Registers the new model
mongoose.model('Todo', TodoSchema);
