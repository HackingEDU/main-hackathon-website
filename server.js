// Require our dependencies
var express = require('express'),
  http = require('http'),
  routes = require('./routes'),
  path = require('path');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Disable etag headers on responses
app.disable('etag');

// Set /public as our static content dir
app.use('/', express.static(path.join(__dirname, 'public/assets')));

// Index Route
app.get('/', routes.home);
app.get('/live', routes.live);

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port,'0.0.0.0', function() {
  console.log('Express server listening on port ' + port);
});
