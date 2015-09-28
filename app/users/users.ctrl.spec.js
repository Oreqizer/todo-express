'use strict';

// Load modules
let app = require('../../app'),
    config = require('../../config/config');

// Load dependencies
let mongoose = require('mongoose'),
    expect = require('chai').expect,
    request = require('supertest'),
    jwt = require('jsonwebtoken');

// Load models
let User = mongoose.model('User');

// Global test variables
var user, user2, token, mock;

describe('User routes:', () => {

  before(() => {

    let id = mongoose.Types.ObjectId();
    mock = {
      id,
      token: jwt.sign({
        iss: id
      }, config.secret)
    };

  });

  beforeEach(done => {

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

    user
      .save()
      .then(() => {
        token = jwt.sign({
          iss: user.id
        }, config.secret);
        return user2.save();
      })
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });

  });

  // Test retrieval routes
  describe('GET /users/:id', () => {

    it('should return a user by id', done => {

      request(app)
        .get(`/api/users/${user.id}`)
        .send({token})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.equal('test');
          done();
        });

    });

    it('should respond with a 401 - no token found', done => {

      request(app)
        .get(`/api/users/${user.id}`)
        .expect(401, done);

    });

    it('should respond with a 404 - user not found', done => {

      request(app)
        .get(`/api/users/${mock.id}`)
        .send({token: mock.token})
        .expect(404, done);

    });

  });

  // Test the update route
  describe('PUT /users/:id', () => {

    it('should update a user info', done => {

      request(app)
        .put(`/api/users/${user.id}`)
        .send({
          token,
          user: {
            username: 'updated'
          }
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.equal('updated');
          done();
        });

    });

    it('should respond with a 401 - wrong user', done => {

      request(app)
        .put(`/api/users/${mock.id}`)
        .send({
          token: token,
          user: {
            username: 'updated'
          }
        })
        .expect(401, done);

    });

    it('should respond with a 401 - no token found', done => {

      request(app)
        .put(`/api/users/${user.id}`)
        .expect(401, done);

    });

  });

  // Test deleting route
  describe('DELETE /users/:id', () => {

    it('should delete the user', done => {

      request(app)
        .delete(`/api/users/${user.id}`)
        .send({token})
        .expect(204, done);

    });

    it('should respond with a 401 - wrong user', done => {

      request(app)
        .delete(`/api/users/${mock.id}`)
        .send({token})
        .expect(401, done);

    });

    it('should respond with a 401 - no token found', done => {

      request(app)
        .delete(`/api/users/${user.id}`)
        .expect(401, done);

    });

  });

  // Test the login route
  describe('POST /login', () => {

    it('should respond with a JWT token', done => {

      request(app)
        .post('/api/login')
        .send({username: 'test', password: 'heslojeveslo'})
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

    it('should respond with a 404 - user not found', done => {

      request(app)
        .post('/api/login')
        .send({username: 'invalidtest', password: 'heslojeveslo'})
        .expect(404, done);

    });

    it('should respond with a 401 - wrong password', done => {

      request(app)
        .post('/api/login')
        .send({username: 'test', password: 'veslojeheslo'})
        .expect(401, done);

    });

  });

  // Test the register route
  describe('POST /register', () => {

    it('should register a new user', done => {

      request(app)
        .post('/api/register')
        .send({username: 'test3', email: 'test3@test.com', password: 'heslojeveslo'})
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.equal('test3');
          expect(res.body.password).not.to.equal('heslojeveslo');
          done();
        });

    });

    it('should resond with a 409 - conflict', done => {

      request(app)
        .post('/api/register')
        .send({username: 'test', email: 'test@test.com', password: 'heslojeveslo'})
        .expect(409, done);

    });

  });

  // Database cleanup
  afterEach(done => {

    User
      .remove()
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });

  });

});
