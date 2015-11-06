var    path = require('path');

module.exports = {
  home: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  },

  live: function(req,res){
    res.sendFile(path.join(__dirname, 'public/live.html'));
  },

  signup: function(req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
  }

}
