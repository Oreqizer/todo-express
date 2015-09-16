'use strict';

// Load modules
let app = require('../../app');

// Load dependencies
let expect = require('expect.js'),
    mongoose = require('mongoose');

// Load models
let User = mongoose.model('User');

// Global test variables
var user;

describe('Unit testing user models:', () => {

  beforeEach((done) => {

    // Create a new 'User' model instance
    user = new User({

      username: 'test',
      email: 'test@test.com',
      password: 'heslojeveslo'

    });

    user.save()
    .then(() => {
      done();
    }, err => {
      done(err);
    });

  });

  // Test user saving
  it('Should save a new user', (done) => {

    // TODO

  });

  // Database cleanup
  afterEach(done => {

    User.remove()
    .then(() => {
      done();
    }, err => {
      done(err);
    });

  });

});