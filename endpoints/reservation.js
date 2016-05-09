"use strict"

class Reservation {

  new(req, res) {
    res.render('./reservation/new', {user: req.user})
  }

}

module.exports = exports = new Reservation();
