var request = require('request');
var base_url = "http://localhost:80/"
var http = require('http');
var expect = require('chai').expect;
var assert = require('assert');
var test = require("../app");
var supertest = require('supertest');
var agent = supertest.agent(test);
var server = supertest.agent('http://localhost:80/');

function loginAdmin() {
    return function(done) {
        agent
            .post('/login')
            .send({ username: 'admin', password: 'insecurepassword' })
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};

function loginUser() {
    return function(done) {
        agent
            .post('/login')
            .send({ username: 'bob', password: 'bob' })
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};

function loginBan() {
    return function(done) {
        agent
            .post('/login')
            .send({ username: 'chris', password: 'chris' })
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};

describe('Basic url testing', function () {
  it('/ should return 200', function (done) {
    http.get('http://localhost:80/', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('/invalidURL should return 404', function (done) {
    http.get('http://localhost:80/invalidURL', function (res) {
      assert.equal(404, res.statusCode);
      done();
    });
  });
});

describe('Test with users as guest (not logged in)', function(){
  it('should show guest a forbidden message on the page when attempting to access users list and return 200', function(done){
    http.get('http://localhost:80/users', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should not allow guest to create new hobbies and redirect user to login page and return 200', function (done) {
    http.get('http://localhost:80/hobby/new', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should allow guest to view hobbies page that contains subscribed users and posts and return 200', function (done) {
    http.get('http://localhost:80/hobby/:id', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should allow guest to view posts by other users in hobbies page and return 200', function (done) {
    http.get('http://localhost:80/hobby/Hobby%203/1', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should not allow guest to create new posts in hobbies and redirect user to login page and return 200', function (done) {
    http.get('http://localhost:80/hobby/:id/newpost', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should not allow guest to subscribe to hobbies and redirect user to login page and return 200', function (done) {
    http.get('http://localhost:80/hobby/:id/subscribe', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});

describe('Test with logged in regular user', function () {
  it('should login with user credentials (username: bob) and return 302', loginUser());
  it('should be able to go to user profile', function(done){
  agent
      .get('/users/bob')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to got to profile edit page and return 200', function(done){
  agent
      .get('/users/bob/edit')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to update profile and redirect to /users/bob and return 302', function(done){
  agent
      .post('/users/bob')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to create new hobbies then redirect to /hobby and return 302', function(done){
  agent
      .post('/hobby')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should not be able to delete hobbies and return 403', function(done){
  agent
      .get('/hobby/:id/delete')
      .expect(403)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to create new posts in hobbies then redirect to /hobby/:id and return 302', function(done){
  agent
      .post('/hobby/:id')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to edit said post then redirect to /hobby/:id/:title and return 302', function(done){
  agent
      .post('/hobby/:id/:title')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to subscribe to a hobby then redirect and return 302', function(done){
  agent
      .post('/hobby/:id/subscribe')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to unsubscribe to a hobby then redirect and return 302', function(done){
  agent
      .post('/hobby/:id/unsubscribe')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should not be able to view users page and get an message page and return 200', function(done){
  agent
      .get('/users')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should successfully logout and return 200', function(done){
  agent
      .get('/hobby/logout')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
});

describe('Test with logged in banned user', function () {
  it('should login with banned user credentials (username: chris) and return 302', loginBan());
  it('should not be able to create new hobby and will render login page and return 200 instead of redirecting after a successful hobby create', function(done){
  agent
      .get('/hobby/new')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should not be able to create new post and will render login page and return 200 instead of redirecting after a successful post create', function(done){
  agent
      .get('/hobby/:id/newpost')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
});

describe('Test with logged in admin', function () {
  it('should login with admin credentials and return 302', loginAdmin());
  it('should be able to go to user profile', function(done){
  agent
      .get('/users/admin')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to got to profile edit page and return 200', function(done){
  agent
      .get('/users/admin/edit')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to update profile and redirect to /users/admin and return 302', function(done){
  agent
      .post('/users/admin')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to view users page and return 200', function(done){
  agent
      .get('/users')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to ban other users (in the case user: sucks) and return 302', function(done){
  agent
      .get('/users/sucks/ban')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to unban other users (in the case user: sucks) and return 302', function(done){
  agent
      .get('/users/sucks/unban')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to delete other users (in the case user: sucks) and return 302', function(done){
  agent
      .get('/users/sucks/delete')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should be able to delete hobbies and return 302', function(done){
  agent
      .get('/hobby/:id/delete')
      .expect(302)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
  it('should successfully logout and return 200', function(done){
  agent
      .get('/hobby/logout')
      .expect(200)
      .end(function(err, res){
          if (err) return done(err);
          done()
      });
  });
});

/*describe('POST /login', function() {
  it('should create a session logged in with admin username and password and should return 302', function(done){
    agent.post('/login')
    .send({username: 'admin', password: 'insecurepassword' })
    .end(function(err, res) {
      expect(res.status).to.equal(302);
      done();
    });
  });
});*/
