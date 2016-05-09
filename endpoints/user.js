"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    encryption = require('../encryption');

// A controller for the users resource
// This should have methods for all the RESTful actions
class users {

  index(req, res) {
    var users = db.all('SELECT * FROM users', function(err, users){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      if(req.user.admin == true){
        res.render('users/index', {users: users, user: req.user});
      }
      else {
        res.render('users/onlyAdmin', {users: users, user: req.user});
      }
    });
  }

  new(req, res) {
    res.render('users/new', {user: req.user});
  }

  redirect(req, res) {
     res.writeHead(301, {"Content-Type":"text/html", "Location":"/users"});
     res.end("This page has moved to <a href='/users'>users</a>");
   }

  create(req,res){
    var form = new formidable.IncomingForm();
    var salt = encryption.salt();
    form.parse(req,function(err,fields,files){
      db.run('INSERT INTO users (username,admin,ban,password_digest,salt) values (?,?,?,?,?)',
        fields.username,
        false,
        false,
        encryption.digest(fields.password+salt),
        salt
        );
      res.redirect('/login');
    });
  }

  destroy(req, res) {
      if (req.params.id != 1)
      {
        db.run('DELETE FROM users WHERE id=?', req.params.id);
      }
      res.redirect('/users');
    }


  ban(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
      db.run('UPDATE users SET ban=? WHERE username=?',
        true,
        req.params.id);
      res.redirect('/users');
    });
  }

  unban(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
      db.run('UPDATE users SET ban=? WHERE username=?',
        false,
        req.params.id);
      res.redirect('/users');
    });
  }
  profile(req,res){
    var profile = db.get('SELECT * FROM users WHERE username=?', req.params.id, function(err, profile){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('users/profile', {profile: profile, user: req.user, name: req.params.id});
    });
  }

  editProfile(req,res){
    var profile = db.get('SELECT * FROM users WHERE username=?', req.params.id, function(err, profile){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('users/editProfile', {profile: profile, user: req.user, name: req.params.id});
    });
  }

  updateProfile(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('UPDATE users SET phone=?,email=?,birthday=?,bio=? WHERE username=? ',
        fields.phone,
        fields.email,
        fields.birthday,
        fields.bio,
        req.params.id);
      res.redirect('/users/'+req.params.id);
    });
  }
}
module.exports = exports = new users();
