var path = require('path');
var https = require("https");
var url = require('url');
var config = require('./config')
var Parse = require("parse").Parse;
var Promise = require("promise");

Parse.initialize(config.parse.test.app_id, config.parse.test.js_key);

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

    try {
      // Begin promise chain
      new Promise(
        function validateFields(resolve, reject) {
          var ajax_counter = 2;  // Number of fields to validate
          var rejections   = []; // Hold rejection fields

          function checkEnd() {
            if(--ajax_counter <= 0) {
              if(rejections.length > 0) {
                return reject({
                  code: 100,
                  message: "Invalid fields",
                  fields: rejections
                });
              } else {
                return resolve( { "is_valid": true } );
              }
            }
          }

          // Validate email with Mailgun REST function
          https.get(
            {
                  auth: "api:" + config.mailgun.pub_key,
              hostname: "api.mailgun.net",
                  path: "/v3/address/validate" +
                        "?address=" + req.body.email
            }
          ).on("response",
            function httpsResponse(https_res) {
              https_res.setEncoding("utf8");
              https_res.on("data", function(data) {
                var d = JSON.parse(data);
                if(d.is_valid != true) { rejections.push("email"); }
                checkEnd();
              });
            }
          ).on("error",
            function httpsError(https_err) {
              rejections.push("email");
              checkEnd();
            }
          );

          // TODO: school validation...
          // possibly another HTTP request? or an internal list of schools
          // yeah let's do that
          checkEnd();
        }
      ).then(
        function saveUser(response) {
          // Sanitize user fields before saving into Parse
          delete req.body.confirm_password; // Remove confirm_password field
          user.set(req.body);
          user.set("username", req.body.email); // Mandatory field... set same as email
          return user.signUp(null);
        }
      ).then(
        function success(user) {
          console.log(user);
          res.end("Account created");
        },
        function error(err) {
          // Potential errors:
          //  -1: Cannot sign up with empty username
          //  -1: Cannot sign up with empty password
          // 202: Username already taken
          //
          //    : Invalid email
          //    : Invalid school
          console.log(err);
          res.end(JSON.stringify(err));
        }
      );

    } catch(e) {
      console.log(e);
      res.end("Internal Server Error");
    }
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
      // Render as JSON
      res.send(tweets);

    });
  }

}
