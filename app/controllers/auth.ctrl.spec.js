'use strict';

// Load the test dependencies
let expect = require('expect.js');

// Load the tested module
let auth = require('./auth.ctrl');

// Global test variables
let user;

// Create 'auth' test suite
describe('Auth controller utility unit tests:', () => {
  
  // Define a pre-tests function
  beforeEach(() => {
    
    user = {
      
      _id: '123456asdfgh',
      username: 'test',
      email: 'test@test.com',
      password: 'heslojeveslo'
      
    };
    
  });

  // Test the 'auth' utility methods
  it('Should hash the password', (done) => {
    
    auth.hash(user.password)
    .then(hash => {
      expect(hash).to.be.a('string');
      expect(hash).not.to.be.equal(user.password);
      done();
    })
    .catch(err => {
      throw err;
    });
    
  });

  it('Should check a hashed password', (done) => {
    
    auth.hash(user.password)
    .then(hash => {
      return auth.checkPassword(user.password, hash);
    })
    .then(match => {
      expect(match).to.be(true);
      done();
    })
    .catch(err => {
      throw err;
    });
    
  });

});