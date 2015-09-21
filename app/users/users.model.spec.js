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

  beforeEach(() => {

    // Create a new 'User' model instance
    user = new User({

      username: 'test',
      email: 'test@test.com',
      password: 'heslojeveslo'

    });

  });

  it('should save a new user correctly', (done) => {

    user.save()
    .then(data => {
      expect(data).to.be.an('object');
      expect(data.username).to.be('test');
      expect(data.password).not.to.be('heslojeveslo');
      done();
    }, err => {
      done(err);
    });

  });

  it('should not save a user without username', (done) => {

    user.username = undefined;

    user.save()
    .then(null, err => {
      expect(err).to.be.an('object');
      done();
    });

  });

  it('should not save a user without email', (done) => {

    user.email = undefined;

    user.save()
    .then(null, err => {
      expect(err).to.be.an('object');
      done();
    });

  });

  it('should not save a user with short password', (done) => {

    user.password = 'abcde';

    user.save()
    .then(null, err => {
      expect(err).to.be.an('object');
      done();
    });

  });

  it('should not save a user twice', (done) => {

    user.save()
    .then(data => {
      let dup = new User({

        username: 'test',
        email: 'test@test.com',
        password: 'heslojeveslo'

      });
      return dup.save();
    })
    .then(null, err => {
      expect(err).to.be.an('object');
      expect(err.code).to.be(11000);
      done();
    });

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
