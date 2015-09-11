'use strict';

module.exports = function(app) {
  
  app.get('/', (req, res) => {
    let date = new Date();
    res.render('index', {
      date
    });
  });
  
};