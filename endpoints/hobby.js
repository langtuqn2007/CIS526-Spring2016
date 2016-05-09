"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    sd = require('showdown'),
    convert = new sd.Converter();

class hobby {
  //get method to show main index and list all hobbies in database
  index(req, res) {
    var hobby = db.all('SELECT * FROM hobby', function(err, hobby){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.render('hobby/index', {hobby: hobby, user: req.user});
    });
  }

  //get method to show users subscribed to current hobby
  showUser(req, res) {
    var hobbyUser = db.all('SELECT * FROM hobbyUser', function(err, hobbyUser){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      var hobbyPost = db.all('SELECT * FROM hobbyPost WHERE hobbyName =?', req.params.id, function(err, hobbyPost){
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }
        res.render('hobby/show', {hobbyUser: hobbyUser, user: req.user, name: req.params.id, post: hobbyPost});
      });
    });
  }

  //get method to add new hobby
  new(req, res) {
    res.render('hobby/newHobby', {user: req.user});
  }

  //post method for adding hobbies
  add(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('INSERT INTO hobby (name) values (?)',
        fields.name
      );
      res.redirect('/hobby');
    });
  }

  //get methdd to delete hobbies from database
  delete(req, res) {
    db.run('DELETE FROM hobby WHERE id=?', req.params.id);
    res.redirect('/hobby');
  }

  //get method for users to subsribe to a hobby
  subscribe(req, res) {
    var hobbyUser = db.all('SELECT * FROM hobbyUser', function(err, hobbyUser){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      db.run('DELETE FROM hobbyUser WHERE hobbyName=? AND userName=?', req.params.id, req.user.username); //temp fix to prevent duplicated user subs,
      db.run('INSERT INTO hobbyUser (hobbyName, username) values(?,?)', req.params.id, req.user.username);//previous data deleted before adding new one
      res.redirect('/hobby/'+ req.params.id);

    });
  }

  //get method for users to unsubscribe from a hobby
  unsubscribe (req, res) {
    db.run('DELETE FROM hobbyUser WHERE hobbyName=? AND userName=?', req.params.id, req.user.username);
    res.redirect('/hobby/'+ req.params.id);
  }

  //get method for new hobby posts
  newPost (req, res) {
    res.render('hobby/newPost', {user: req.user, name: req.params.id});
  }

  //post method for new hobby posts
  createPost (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('INSERT INTO hobbyPost (hobbyName, title, body, author) values (?,?,?,?)',
        req.params.id,
        fields.title,
        fields.body,
        req.user.username
      );
      res.redirect('/hobby/'+ req.params.id);
    });
  }

  //get method to show all posts under a particular hobby
  showPost (req, res) {
    var hobbyPost = db.get('SELECT * FROM hobbyPost WHERE hobbyName =? AND title =?', req.params.id, req.params.title, function(err, hobbyPost){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.render('hobby/showPost', { user: req.user, post: hobbyPost, name: req.params.id});
    });
  }

  //get method to edit posts
  editPost(req, res) {
    var post = db.get('SELECT * FROM hobbyPost WHERE title=?', req.params.title, function(err, item){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
    res.render('hobby/editPost', {post: item, user: req.user, name: req.params.id});
  });
  }

  //post method to edit posts
  updatePost(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('UPDATE hobbyPost SET title=?, body=? WHERE title=? ',
        req.params.title,
        fields.body,
        req.params.title);
      res.redirect('/hobby/'+req.params.id+'/'+req.params.title);
    });
  }

  //get method to delete posts
  deletePost(req, res) {
    db.run('DELETE FROM hobbyPost WHERE hobbyName=? AND title=?', req.params.id, req.params.title);
    res.redirect('/hobby/'+req.params.id);
  }


}
module.exports = exports = new hobby();
