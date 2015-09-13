'use strict';

// Load the test dependencies
let expect = require('expect.js'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken');

// Load the tested modules
let app = require('../../app'),
    config = require('../../config/config'),
    User = mongoose.model('User');

// Global test variables
var user, user2;

// Create 'user' test suite
describe('Unit testing user routes:', () => {
  
  // Define a pre-tests function
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
      return user2.save();
    })
    .then(() => {
      done();
    }, err => {
      done(err);
    });
    
  });

  // Test the 'user' routes and methods
  it('Should GET all users', (done) => {
    
    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(2);
        expect(res.body[0].username).to.be('test');
        done();
      });
    
  });
  
  it('Should GET a user by id', (done) => {
    
    request(app)
      .get(`/api/users/${user._id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.username).to.be('test');
        done();
      });
    
  });
  
  it('Should update a user info', (done) => {
    
    let token = jwt.sign({
      iss: user._id
    }, config.secret);
    
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
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.username).to.be('updated');
        done();
      });
    
  });
  
  it('Should delete the user', (done) => {
    
    let token = jwt.sign({
      iss: user._id
    }, config.secret);
    
    request(app)
      .delete(`/api/users/${user._id}`)
      .send({
        token: token
      })
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
    
  });
  
  it('Should respond with a JWT token', (done) => {
    
    request(app)
      .post('/api/login')
      .send({ username: 'test', password: 'heslojeveslo' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.token).to.be.a('string');
        expect(res.body.expires).to.be.a('number');
        expect(res.body.user).to.be.an('object');
        done();
      });
    
  });
  
  it('Should register a new user', (done) => {
    
    request(app)
      .post('/api/register')
      .send({ username: 'test3', email: 'test3@test.com', password: 'heslojeveslo' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.username).to.be('test3');
        expect(res.body.password).not.to.be('heslojeveslo');
        done();
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