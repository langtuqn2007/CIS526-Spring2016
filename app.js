var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    loadUser = require('./middleware/load_user'),
    noGuests = require('./middleware/no_guests'),
    adminOnly = require('./middleware/admin_only'),
    noBan = require('./middleware/no_ban'),
    encryption = require('./encryption'),
    request = require('request');

module.exports = app;
// Enable template engine
app.set('view engine', 'ejs');
app.set('views', './templates');

// Enable sessions
app.use(sessions({
  cookieName: 'session',
  secret: 'somerandomstring',
  duration: 24*60*60*1000,
  activeDuration: 1000*60*5
}));

// Load the user (if there is one)
app.use(loadUser);

// Serve static files
app.use(express.static('public'));

// Login routes
var session = require('./endpoints/session');
app.get('/login', session.new);
app.post('/login', session.create);
app.get('/logout', session.destroy);

// post routes
var post = require('./endpoints/post');
app.get('/', post.index);

//hobby routes
var hobby = require('./endpoints/hobby');
app.get('/hobby', hobby.index);
app.get('/hobby/new', noBan, hobby.new);
app.post('/hobby', hobby.add);
app.get('/hobby/:id/delete',adminOnly, hobby.delete);
app.get('/hobby/:id', hobby.showUser);
app.get('/hobby/:id/subscribe',noGuests, hobby.subscribe);
app.get('/hobby/:id/unsubscribe',noGuests, hobby.unsubscribe);
app.get('/hobby/:id/newpost',noBan, hobby.newPost);
app.post('/hobby/:id',noGuests, hobby.createPost);
app.get('/hobby/:id/:title', hobby.showPost);
app.get('/hobby/:id/:title/edit', hobby.editPost);
app.post('/hobby/:id/:title', hobby.updatePost);
app.get('/hobby/:id/:title/delete', hobby.deletePost);

// users routes
var users = require('./endpoints/user');
app.get('/users', users.index);
app.get('/users/new', users.new);
app.post('/users/new', users.create);
app.get('/users/:id/delete', users.destroy);
app.get('/users/:id/ban', users.ban);
app.get('/users/:id/unban', users.unban);
app.get('/users/:id', users.profile);
app.get('/users/:id/edit', users.editProfile);
app.post('/users/:id', users.updateProfile);

// Reservation routes
var reservation = require('./endpoints/reservation');
app.get('/reservation/new', noGuests, reservation.new);

app.listen(80, () => {
  console.log("Listening on port 80...");
});

exports.closeServer = function() {
  server.close();
};
