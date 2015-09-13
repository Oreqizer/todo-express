'use strict';

// Load main modules
let express = require('express');

// Load secondary modules
let bodyParser = require('body-parser'),
    morgan = require('morgan'),
	compress = require('compression');

// Load Express plugins
let handlebars = require('express-handlebars');

// Define the Express configuration method
module.exports = function() {
  // Create a new Express application instance
  let app = express();

  // Use the 'NODE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
  if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
      app.use(compress());
  }

  // Use 'body-parser' for jsons
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  
  // Configure the templating engine
  app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    layoutsDir: 'app/views/layouts/'
  }));
  app.set('view engine', 'handlebars');

  // Set the application view engine and 'views' folder
  app.set('views', './app/views');

  // Load the routing files
  require('../app/routes/users.routes')(app);

  // Configure static file serving
  app.use(express.static('./public'));
  
  // Configure error handler:
  app.use(function(err, req, res, next) {
    
    err.message = err.message || 'Internal server error';
    err.status = err.status || 500;
    res.status(err.status).send(err.message);
    
  });

  // Return the Server instance
  return app;
};