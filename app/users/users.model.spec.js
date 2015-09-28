'use strict';

// Load modules
require('../../app');

// Load dependencies
let expect = require('chai').expect,
    mongoose = require('mongoose');

// Load models
let User = mongoose.model('User');

// Global test variables
var user;

describe('User model:', () => {

  beforeEach(() => {

    // Create a new 'User' model instance
    user = new User({

      username: 'test',
      email: 'test@test.com',
      password: 'heslojeveslo',
      firstName: 'Test',
      lastName: 'Subject',
      webpage: 'google.com'

    });

  });

  // Test correct input
  describe('Valid input and normalization', () => {

    it('should save a new user', done => {

      user
        .save()
        .then(data => {
          expect(data).to.be.an('object');
          expect(data.id).to.be.a('string');
          expect(data.username).to.equal('test');
          expect(data.email).to.equal('test@test.com');
          expect(data.firstName).to.equal('Test');
          expect(data.lastName).to.equal('Subject');
          expect(data.webpage).to.equal('google.com');
          done();
        })
        .catch(err => {
          done(err);
        });

    });

    it('should hash the password', done => {

      user
        .save()
        .then(data => {
          expect(data.password).not.to.equal('heslojeveslo');
          done();
        })
        .catch(err => {
          done(err);
        });

    });

    it('should normalize first name', done => {

      user.firstName = 'tEst';

      user
        .save()
        .then(data => {
          expect(data.firstName).to.equal('Test');
          done();
        })
        .catch(err => {
          done(err);
        });

    });

    it('should normalize last name', done => {

      user.lastName = 'sUBjEcT';

      user
        .save()
        .then(data => {
          expect(data.lastName).to.equal('Subject');
          done();
        })
        .catch(err => {
          done(err);
        });

    });

  });

  // Test invalid input
  describe('Invalid input', () => {

    it('should not save a user without username', done => {

      user.username = undefined;

      user
        .save()
        .then(() => {
          done(new Error('should not have saved'));
        })
        .catch(err => {
          expect(err).to.be.an('object');
          done();
        });

    });

    it('should not save a user without email', done => {

      user.email = undefined;

      user
        .save()
        .then(() => {
          done(new Error('should not have saved'));
        })
        .catch(err => {
          expect(err).to.be.an('object');
          done();
        });

    });

    it('should not save a user with short password', done => {

      user.password = 'abcde';

      user
        .save()
        .then(() => {
          done(new Error('should not have saved'));
        })
        .catch(err => {
          expect(err).to.be.an('object');
          done();
        });

    });

    it('should not save a user with invalid webpage url', done => {

      user.webpage = 'google';

      user
        .save()
        .then(() => {
          done(new Error('should not have saved'));
        })
        .catch(err => {
          expect(err).to.be.an('object');
          done();
        });

    });

    it('should not save a user with invalid first name', done => {

      user.firstName = 't3st';

      user
        .save()
        .then(() => {
          done(new Error('should not have saved'));
        })
        .catch(err => {
          expect(err).to.be.an('object');
          done();
        });

    });

    it('should not save a user with invalid last name', done => {

      user.lastName = 'subj3ct';

      user
        .save()
        .catch(err => {
          expect(err).to.be.an('object');
          done();
        });

    });

  });

  // Test duplicate input
  describe('Duplicate input', () => {

    it('should not save a user with duplicate username', done => {

      user
        .save()
        .then(() => {
          let dup = new User({

            username: 'test',
            email: 'test5@test.com',
            password: 'heslojeveslo'

          });
          return dup.save();
        })
        .catch(err => {
          expect(err).to.be.an('object');
          expect(err.code).to.equal(11000);
          done();
        });

    });

    it('should not save a user with duplicate email', done => {

      user
        .save()
        .then(() => {
          let dup = new User({

            username: 'test5',
            email: 'test@test.com',
            password: 'heslojeveslo'

          });
          return dup.save();
        })
        .catch(err => {
          expect(err).to.be.an('object');
          expect(err.code).to.equal(11000);
          done();
        });

    });

  });

  // Database cleanup
  afterEach(done => {

    User
      .remove()
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });

  });

});
