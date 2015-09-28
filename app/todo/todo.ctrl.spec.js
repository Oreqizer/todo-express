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
let User = mongoose.model('User'),
    Todo = mongoose.model('Todo');

// Global test variables
let todo, todo2, client, mock;

describe('Todo routes:', () => {

  before(() => {

    let user = new User({

      username: 'test',
      email: 'test@test.com',
      password: 'heslojeveslo'

    });

    client = {
      user,
      token: jwt.sign({
        iss: user._id
      }, config.secret)
    };

    let id = mongoose.Types.ObjectId();
    mock = {
      id,
      token: jwt.sign({
        iss: id
      }, config.secret)
    };

  });

  beforeEach(done => {

    // Create new 'Todo' model instances
    todo = new Todo({

      title: 'Test',
      content: 'Test TODO',
      _owner: client.user.id

    });

    todo2 = new Todo({

      title: 'Test 2',
      content: 'Test TODO 2',
      _owner: client.user.id

    });

    todo
      .save()
      .then(() => {
        return todo2.save();
      })
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });

  });

  // Test retrieval route
  describe('GET /todos/:', () => {

    it('should return all todos of a user', done => {

      request(app)
        .get('/api/todos')
        .send({token: client.token})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          done();
        });

    });

    it('should return a todo', done => {

      request(app)
        .get(`/api/todos/${todo.id}`)
        .send({token: client.token})
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.equal('Test');
          done();
        });

    });

    it('should respond with a 404 - todo not found', done => {

      request(app)
        .get(`/api/todos/${mock.id}`)
        .send({token: client.token})
        .expect(404, done);

    });

  });

  // Test posting route
  describe('POST /todos/', () => {

    it('should save a new todo', done => {

      request(app)
        .post('/api/todos')
        .send({
          token: client.token,
          todo: {
            title: 'New',
            content: 'Sample text'
          }
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.equal('New');
          done();
        });

    });

    it('should respond with a 401 - unauthorized', done => {

      request(app)
        .post('/api/todos')
        .send({
          todo: {
            title: 'New',
            content: 'Sample text'
          }
        })
        .expect(401, done);

    });

  });

  // Test updating route
  describe('PUT /todos/:id', () => {

    it('should update the todo', done => {

      request(app)
        .put(`/api/todos/${todo.id}`)
        .send({
          token: client.token,
          todo: {
            title: 'Updated',
            content: 'Updated text',
            done: true
          }
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.equal('Updated');
          done();
        });

    });

    it('should not respond with a 401 - unauthorized', done => {

      request(app)
        .put(`/api/todos/${todo.id}`)
        .send({
          token: mock.token,
          todo: {
            title: 'Updated',
            content: 'Updated text'
          }
        })
        .expect(401, done);

    });

    it('should not respond with a 404 - todo not found', done => {

      request(app)
        .put(`/api/todos/${mock.id}`)
        .send({
          token: client.token,
          todo: {
            title: 'Updated',
            content: 'Updated text'
          }
        })
        .expect(404, done);

    });

  });

  // Test deleting route
  describe('DELETE /todos/:id', () => {

    it('should delete the todo', done => {

      request(app)
        .delete(`/api/todos/${todo.id}`)
        .send({token: client.token})
        .expect(204, done);

    });

    it('should respond with a 401 - unauthorized', done => {

      request(app)
        .delete(`/api/todos/${todo.id}`)
        .send({token: mock.token})
        .expect(401, done);

    });

    it('should respond with a 404 - todo not found', done => {

      request(app)
        .delete(`/api/todos/${mock.id}`)
        .send({token: client.token})
        .expect(404, done);

    });

  });

  // Database cleanup
  afterEach(done => {

    Todo
      .remove()
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });

  });

});
