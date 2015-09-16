'use strict';

// Development config
module.exports = {
  db: 'localhost/todo-dev',
  env: 'development',
  port: process.env.PORT || 3000,
  secret: 'lolomgwtfroflmao_dev',
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
