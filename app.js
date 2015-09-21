'use strict';

/**
 * Loads the configured modules and starts the application
 * @module app
 */

// Load configured modules
let express = require('./config/express'),
    mongoose = require('./config/mongoose');

// Load config
let config = require('./config/config');

// Start the app and database
let db = mongoose(),
    app = express();

// Listen at port 3000
app.listen(config.port);

console.log(`Running '${config.env}' app at port ${config.port}.`);

/** Configured application */
module.exports = app;
