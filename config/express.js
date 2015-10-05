'use strict';

/**
 * Configuration of the Express instance
 * @module Express
 */

// Load main modules
const express = require('express');

// Load middleware modules
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compress = require('compression');

// Load helper modules
const wrench = require('wrench');

// Load Express plugins
const handlebars = require('express-handlebars');

/**
 * Sets up all the necessary configuration of Express
 * @returns {Object} the Express application instance
 */
module.exports = function() {

  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    layoutsDir: 'app/views/layouts/'
  }));

  app.set('view engine', 'handlebars');
  app.set('views', './app/views');

  // Loads all routers
  wrench
    .readdirSyncRecursive('./app')
    .filter(file => (/\.routes\.js$/i).test(file))
    .map(file => {
      require(`../app/${file}`)(app);
    });

  app.use(express.static('./public'));

  // [Middleware] Error handler
  app.use(function(err, req, res) {

    err.message = err.message || 'Internal server error';
    err.status = err.status || 500;
    res.status(err.status).send(err.message);

  });

  return app;

};
