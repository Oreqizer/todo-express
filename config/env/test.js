'use strict';

// Test config
module.exports = {
  db: 'localhost/todo-test',
  env: 'test',
  port: process.env.PORT || 3000,
  secret: 'lolomgwtfroflmao_test',
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
