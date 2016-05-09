var db = require('../db'),
    encryption = require('../encryption');

// Create the database schema and populate
db.serialize(function() {

  // Drop users table if it exists
  db.run("DROP TABLE IF EXISTS users");
  // Create the users table
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, admin BOOLEAN, ban BOOLEAN, password_digest TEXT, salt TEXT, phone TEXT, email TEXT, birthday TEXT, bio TEXT)");
  // Create a default user
  var salt = encryption.salt();
  db.run("INSERT INTO users (username, admin, ban, password_digest, salt) values (?,?,?,?,?)",
    'admin',
    true,
    false,
    encryption.digest('insecurepassword' + salt),
    salt
  );
  db.run("INSERT INTO users (username, admin, ban, password_digest, salt) values (?,?,?,?,?)",
    'bob',
    false,
    true,
    encryption.digest('bob' + salt),
    salt
  );
  db.run("INSERT INTO users (username, admin, ban, password_digest, salt) values (?,?,?,?,?)",
    'chris',
    false,
    false,
    encryption.digest('chris' + salt),
    salt
  );
  // Log contents of the user table to the console
  db.each("SELECT * FROM users", function(err, row){
    if(err) return console.error(err);
    console.log(row);
  });


  // Drop hobby table if it exists
  db.run("DROP TABLE IF EXISTS hobby");
  // Create the hobby table
  db.run("CREATE TABLE hobby (id INTEGER PRIMARY KEY, name VARCHAR(64))");
  /*for(var i = 0; i < 5; i++) {
    db.run("INSERT INTO hobby (name) VALUES ('Hobby "+i+"')");
  }*/

  // Drop hobbyUser table if it exists
  db.run("DROP TABLE IF EXISTS hobbyUser");
  // Create the hobbyUser table
  db.run("CREATE TABLE hobbyUser (id INTEGER PRIMARY KEY, hobbyName VARCHAR(64), userName VARCHAR(64) )");

  // Drop hobbyPost table if it exists
  db.run("DROP TABLE IF EXISTS hobbyPost");
  // Create the hobbyPost table
  db.run("CREATE TABLE hobbyPost (id INTEGER PRIMARY KEY, hobbyName VARCHAR(64),  title VARCHAR(64), body TEXT, author VARCHAR(64))");
});
