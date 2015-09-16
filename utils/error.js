'use strict';

// Helper error handlers to keep the code dry
exports.error = function(code, message) {
  let err = new Error(message);
  err.status = code;
  return err;
};

exports.mongoError = function(err) {

  err.status = 409;

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        err.message = 'Username or email already taken';
        break;
      default:
        err.message = 'Database error';
    }
  } else {
    err.message = err.toString();
  }

  return err;

};
