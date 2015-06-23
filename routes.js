var path = require('path');
var url = require('url');
var Config = require('./config')
var Parse = require("parse").Parse;

Parse.initialize(Config.parse.test.id, Config.parse.test.js_key);

module.exports = {
  home: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  },

  signup: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
  },

  newUser: function(req, res) {
    // newUser AJAX call
    // Validate user information, then save into parse database

    // Returns success message on user creation
    // TODO: return undefined on user creation
    // Returns error code and reason
    var user = new Parse.User();

    // TODO: field validation
    // Validate school
    // Validate email
    delete req.body["confirm_password"]; // Remove confirm_password field

    user.set(req.body);
    user.set("username", req.body.email); // Mandatory field... set same as email

    user.signUp(null).then(
      function success(user) {
        res.end("User created!");
      },
      function error(err) {
        // Potential errors:
        //  -1: Cannot sign up with empty username
        //  -1: Cannot sign up with empty password
        // 202: Username already taken
        res.end("Error: "  + err.code + " " + err.message);
      }
    );
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
      // Render as JSON
      res.send(tweets);

    });
  }

}
