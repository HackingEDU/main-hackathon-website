var path = require('path');
var request = require("request");
var Promise = require("promise");

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

    // AJAX promise definitions
    var validate = function() {
      return new Promise(
        function(resolve, reject) {
          // Request to validate fields
          request.post("http://hackingedu.parseapp.com/actions/v62110a75095ebf61417a51fff9af9c7f",
            { form: req.body },
            function(err, response, body) {
              // @body:
              //   code: 200 if successful
              //   message: "blahblahblah"
              //   fields: [ "invalid", "fields" ]

              body = JSON.parse(body);
              if(body.code == 200) { resolve(body); }
              else                 {  reject(body); }
            }
          );
        }
      );
    }


    var createUser = function() {
      return new Promise(
        function(resolve, reject) {
          // Request to create a new user
          request.post("http://hackingedu.parseapp.com/actions/n0354d89c28ec399c00d3cb2d094cf093",
            { form: req.body },
            function(err, response, body) {
              if(err) { reject(err);   }
              else    { resolve(body); }
            }
          );
        }
      );
    };

    validate().then(
      function handleValidated(retval) {
        // retval = { code: ..., message: ..., fields: ...
        //  @code: status code
        //  @message: ...
        //  @fields: Array of invalid fields, if any
        if(retval.fields !== undefined) { return Promise.reject(retval); }
        else                            { return createUser(); }
      }

    ).then(
      function handleCreated(retval) {
        // retval = { code: ..., message: ..., fields: ...
        //  @code: status code
        //  @message: ...
        res.end(retval);
      },
      function ajaxError(err) {
        // TODO: okay I'm not sure why we have to stringify this
        // Super inconsistent for some reason, it hangs if we try to send the whole object!
        res.end(JSON.stringify(err));
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
