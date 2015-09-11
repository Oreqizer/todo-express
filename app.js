'use strict';

// Load configured modules
let express = require('./config/express');

// Start the app
let app = express();

// Listen at port 3000
app.listen(3000);

console.log('App listening at port 3000.');