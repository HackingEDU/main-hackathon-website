var path = require('path');
var querystring = require("querystring");
var request = require("request");
var https = require("https");
var url = require('url');
var Promise = require("promise");
var config = require('./config')

module.exports = {
  home: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  },

  signup: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
  },

  newUser: function(req, res) {
    // Create User URL: hackingedu.parseapp.com/actions/n0354d89c28ec399c00d3cb2d094cf093
    //  Validation URL: hackingedu.parseapp.com/actions/v62110a75095ebf61417a51fff9af9c7f

    // This is now a proxy to Cloud Code: will probably be better for security
    // Also, all the validation is now handled by Parse servers (cloud code),
    // might be better for server load
    var post_data = querystring.stringify(req.body);

    // AJAX promise definitions
    var validate = new Promise(
      function(resolve, reject) {
        // Validate fields
        var val_request = https.request(
          {
              method: "POST",
            hostname: "hackingedu.parseapp.com",
                path: "/actions/v62110a75095ebf61417a51fff9af9c7f", // Validation AJAX
             headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": post_data.length
                      }
          }
        ).on("response", function httpsResponse(response) {
            response.setEncoding("utf8");
            response.on("data", function(chunk) {
              resolve(chunk);
            });
          }
        ).on("error", function httpsResponse(response) {
            console.log("POST error...?");
            reject(response);
          }
        );

        val_request.write(post_data);
        val_request.end();
      }
    );

    var createUser = new Promise(
      function(resolve, reject) {
        // Validate fields
        var new_request = https.request(
          {
              method: "POST",
            hostname: "hackingedu.parseapp.com",
                path: "/actions/n0354d89c28ec399c00d3cb2d094cf093", // New User AJAX
             headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": post_data.length
                      }
          }
        ).on("response", function httpsResponse(response) {
            response.setEncoding("utf8");
            response.on("data", function(chunk) {
              resolve(chunk);
            });
          }
        ).on("error", function httpsResponse(response) {
            console.log("POST error...?");
            reject(response);
          }
        );

        new_request.write(post_data);
        new_request.end();
      }
    );



    validate.then(
      function handleValidated(retval) {
        // retval = { code: ..., message: ..., fields: ...
        //  @code: status code
        //  @message: ...
        //  @fields: Array of invalid fields, if any
        retval = JSON.parse(retval);
        if(retval.fields.length > 0) return Promise.reject(retval);
        return createUser;
      }
    ).then(
      function handleCreated(retval) {
        // retval = { code: ..., message: ..., fields: ...
        //  @code: status code
        //  @message: ...
        //  @fields: Array of invalid fields, if any
        console.log(retval);
        res.end(retval);
      },
      function ajaxError(err) {
        console.log(err);
        res.end(err);
      }
    );

  },

  unsubscribe: function(req, res) {
    // User email unsubscribe page
    //    @q: User's registration hash
    //    @u: If set, unsubscribe this user from further emails
    if(req.query.u) {
      request.post("http://hackingedu.parseapp.com/webhooks/u63e1c9c825c067ac7475a85f606f6c72",
        { form: { q: req.query.q } },
        function(err, response, body) {
          if(err) { console.log(err); }
          else {
            console.log(body);
          }

        }
      );
    }
    res.sendFile(path.join(__dirname, 'public/unsubscribe.html'));
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
      // Render as JSON
      res.send(tweets);

    });
  }

}
