'use strict';

// Load configured modules
let express = require('./config/express'),
    mongoose = require('./config/mongoose');

// Start the app and database
let db = mongoose(),
    app = express();

// Listen at port 3000
app.listen(3000);

console.log('App listening at port 3000.');

module.exports = app;