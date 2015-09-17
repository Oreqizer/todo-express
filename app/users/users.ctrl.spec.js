'use strict';

// Load modules
let app = require('../../app'),
    config = require('../../config/config');

// Load dependencies
let mongoose = require('mongoose'),
    expect = require('expect.js'),
    request = require('supertest'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash');

// Load models
let User = mongoose.model('User');

// Global test variables
var user, user2, token;

describe('User routes:', () => {

  beforeEach((done) => {

    // Create new 'User' model instances
    user = new User({

      username: 'test',
      email: 'test@test.com',
      password: 'heslojeveslo'

    });

    user2 = new User({

      username: 'test2',
      email: 'test2@test.com',
      password: 'heslojeveslo'

    });

    user.save()
    .then(() => {
      token = jwt.sign({
        iss: user._id
      }, config.secret);
      return user2.save();
    })
    .then(() => {
      done();
    }, err => {
      done(err);
    });

  });

  // Test retrieval routes
  describe('GET /users/', () => {

    it('should return all users', (done) => {

      request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          expect(res.body[0].username).to.be('test');
          done();
        });

    });

    it('should return a user by id', (done) => {

      request(app)
        .get(`/api/users/${user._id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.be('test');
          done();
        });

    });

    it('should respond with a 404 - user not found', (done) => {

      request(app)
        .get('/api/users/aaaaaaaabbbbbbbbcccccccc')
        .expect(404, done);

    });

    it('should respond with a 409 - conflict', (done) => {

      request(app)
        .get('/api/users/randomuser')
        .expect(409, done);

    });

  });

  // Test the update route
  describe('PUT /users/:id', () => {

    it('should update a user info', (done) => {

      request(app)
        .put(`/api/users/${user._id}`)
        .send({
          token: token,
          user: {
            username: 'updated'
          }
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.be('updated');
          done();
        });

    });

    it('should respond with a 401 - wrong user', (done) => {

      request(app)
        .put(`/api/users/${user2._id}`)
        .send({
          token: token,
          user: {
            username: 'updated'
          }
        })
        .expect(401, done);

    });

    it('should respond with a 401 - no token found', (done) => {

      request(app)
        .put(`/api/users/${user._id}`)
        .expect(401, done);

    });

  });

  // Test deleting route
  describe('DELETE /users/:id', () => {

    it('should delete the user', (done) => {

      request(app)
        .delete(`/api/users/${user._id}`)
        .send({
          token: token
        })
        .expect(204, done);

    });

    it('should respond with a 401 - wrong user', (done) => {

      request(app)
        .delete(`/api/users/${user2._id}`)
        .send({
          token: token
        })
        .expect(401, done);

    });

    it('should respond with a 401 - no token found', (done) => {

      request(app)
        .delete(`/api/users/${user._id}`)
        .expect(401, done);

    });

  });

  // Test the login route
  describe('POST /login', () => {

    it('should respond with a JWT token', (done) => {

      request(app)
        .post('/api/login')
        .send({username: 'test', password: 'heslojeveslo'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.token).to.be.a('string');
          expect(res.body.expires).to.be.a('number');
          expect(res.body.user).to.be.an('object');
          done();
        });

    });

    it('should respond with a 404 - user not found', (done) => {

      request(app)
        .post('/api/login')
        .send({username: 'invalidtest', password: 'heslojeveslo'})
        .expect(404, done);

    });

    it('should respond with a 401 - wrong password', (done) => {

      request(app)
        .post('/api/login')
        .send({username: 'test', password: 'veslojeheslo'})
        .expect(401, done);

    });

  });

  // Test the register route
  describe('POST /register', () => {

    it('should register a new user', (done) => {

      request(app)
        .post('/api/register')
        .send({username: 'test3', email: 'test3@test.com', password: 'heslojeveslo'})
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.be('test3');
          expect(res.body.password).not.to.be('heslojeveslo');
          done();
        });

    });

    it('should resond with a 409', (done) => {

      request(app)
        .post('/api/register')
        .send({username: 'test', email: 'test@test.com', password: 'heslojeveslo'})
        .expect(409, done);

    });

  });

  // Database cleanup
  afterEach(done => {

    User.remove()
    .then(() => {
      done();
    }, err => {
      done(err);
    });

  });

});
