var path = require('path');
var url = require('url');
var Config = require('./config')
var Parse = require('node-parse-api').Parse;
var options = {

    app_id: '8DnPzMRHvMamLLizP0GIRyIRMVOFqRKpMzmp1G5d',
    api_key: '9v4U5x8fBjZ0N0wgbM5ffMfAa9ESHjgx1yPXQmDY'
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
