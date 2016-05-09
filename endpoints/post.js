"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    sd = require('showdown'),
    convert = new sd.Converter();
    //marked = require('marked');

// A controller for the post resource
// This should have methods for all the RESTful actions
class post {

  index(req, res) {
      res.render('post/index', { user: req.user});
  }

}

module.exports = exports = new post();
