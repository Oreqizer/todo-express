'use strict';

// Load main modules
let express = require('express');

// Load middleware modules
let bodyParser = require('body-parser'),
    morgan = require('morgan'),
  compress = require('compression');

// Load helper modules
let wrench = require('wrench');

// Load Express plugins
let handlebars = require('express-handlebars');

module.exports = function() {

  let app = express();

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

  // Load all routers
  wrench.readdirSyncRecursive('./app')
  .filter(file => (/\.routes\.js$/i).test(file))
  .map(file => {
    require(`../app/${file}`)(app);
  });

  app.use(express.static('./public'));

  // Configure error handler:
  app.use(function(err, req, res, next) {

    err.message = err.message || 'Internal server error';
    err.status = err.status || 500;
    res.status(err.status).send(err.message);

  });

  return app;
};
