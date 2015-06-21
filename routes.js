var path = require('path');
var url = require('url');
var Config = require('./config')
var Parse = require('node-parse-api').Parse;
var options = {
    app_id: Config.parse.test.id,
    api_key: Config.parse.test.api_key
};

var parse = new Parse(options);

module.exports = {
  home: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  },

  signup: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
  },

  newUser: function(req, res) {
    parse.insert('TestUser', req.body, function(err, response) {
      if (err) {
        console.log('error: '+JSON.stringify(err));
      }

      var msg = err ? err.error : 'Your account was created!';
      res.end(JSON.stringify({success: err === null, msg: msg}));
    });
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
      // Render as JSON
      res.send(tweets);

    });
  }

}