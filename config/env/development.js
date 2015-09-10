'use strict';

// Development config
module.exports = {
  db: 'localhost/todo-dev',
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