'use strict';

/**
 * Contains user model schema, validators and normalizers
 * @namespace todo
 * @module todoModel
 */

// Load dependencies
const mongoose = require('mongoose');

// Load module builder
const Schema = mongoose.Schema;

/**
 * Defines the todo model schema
 * @class
 */
const TodoSchema = new Schema({

  title: {type: String, required: true, index: true},
  content: {type: String},
  importance: {type: String, enum: ['weak', 'neutral', 'strong'], default: 'neutral'},
  done: {type: Boolean, default: false},
  created: {type: Date, default: Date.now},
  _owner: {type: String, ref: 'User', index: true}

});

// Registers the new model
mongoose.model('Todo', TodoSchema);
