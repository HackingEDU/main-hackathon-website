var    path = require('path');
var  config = require('./config');
var   Parse = require("parse").Parse;
var     md5 = require("./md5").hex_md5;
Parse.initialize('8DnPzMRHvMamLLizP0GIRyIRMVOFqRKpMzmp1G5d', '9v4U5x8fBjZ0N0wgbM5ffMfAa9ESHjgx1yPXQmDY');



module.exports = {
  home: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  },

  live: function(req,res){
    res.sendFile(path.join(__dirname, 'public/live.html'));
  },

  signup: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
  },

  newUser: function(req, res) {
    // Create User URL: hackingedu.parseapp.com/actions/n0354d89c28ec399c00d3cb2d094cf093
    //  Validation URL: hackingedu.parseapp.com/actions/v62110a75095ebf61417a51fff9af9c7f

    // Validation is handled with Parse Cloud function
    // Due to Parse.File cloud code constraints, user creation is handled here

    // Detach resume_file from body
    var resume_b64 = req.body.resume_file;
    var resume_ex  = req.body.resume_file_ex;
    delete req.body.resume;
    delete req.body.resume_file;
    delete req.body.resume_file_ex;

    Parse.Cloud.run("validateFields", { body: req.body }).then(
      function validatedUser(retval) {
        // Create user
        var user = new Parse.User();
        for(var key in req.body) { user.set(key, req.body[key]); } // Set all user keys
        user.unset("confirm_password");        // We really don't need to know this
        user.set("username",  req.body.email); // Mandatory field... set same as email
        user.set("hash", md5(req.body.email)); // TODO: set hash to involve time

        // Create Parse file
        var resume = new Parse.File(
          req.body.firstname + resume_ex, // TODO: firstname field will change
          { base64: resume_b64 }
        );
        if(resume === undefined) {
          resume = { save: function() {
            return Parse.Promise.error({ message: "Cannot create Parse.File" });
          } };
        }

        // Create seperate reference for resume file
        var File = Parse.Object.extend("Files");
        var file = new File();

        // Save all objects
        return Parse.Promise.when(user.signUp(null), resume.save(null), file.save(null));
      }

    ).then(
      function userCreated(user_retval, resume_retval, file_retval) {
        // Create additional reference in Files
        file_retval.set({
          "user": {
            "__type": "Pointer",
            "className": "_User",
            "objectId": user_retval.id
          }
        });
        file_retval.set("file",           resume_retval);
        file_retval.set("filename", resume_retval.url());

        // Cross reference user with Files
        user_retval.set("resume", resume_retval);
        user_retval.set({
          "resume": {
            "__type": "Pointer",
            "className": "Files",
            "objectId": file_retval.id
          }
        });

        return Parse.Promise.when(
          user_retval.save(null),
          file_retval.save(null)
        );
      }

    ).then(
      function successes(user_retval, file_retval) {
        res.status(200).send({
          code: 200,
          message: "User saved"
        });
      },
      function errors(err) {
        var message = { code: 406 };
        if(err !== Array && err !== undefined) {
          var sub = JSON.parse(err.message);
          message.message = sub.message;
          message.fields  = sub.fields;
        } else {
          message.message = err;
        }

        res.status(406).send(message);
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
