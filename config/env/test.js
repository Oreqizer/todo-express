'use strict';

// Test config
module.exports = {
  db: 'localhost/todo-test',
  facebook: {
    clientID: 'XXX',
    clientSecret: 'XXX',
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
  },
  google: {
    clientID: 'XXX',
    clientSecret: 'XXX',
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  }
};