'use strict';

let vars = require('../variables');

// Production config
module.exports = {
  db: vars.db,
  env: vars.env,
  port: vars.port,
  secret: vars.secret,
  facebook: {
    clientID: 'XXX',
    clientSecret: 'XXX',
    callbackURL: `${vars.url}/api/auth/facebook/callback`
  },
  google: {
    clientID: 'XXX',
    clientSecret: 'XXX',
    callbackURL: `${vars.url}/api/auth/google/callback`
  }
};
