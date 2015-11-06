// Require our dependencies
var express = require('express'),
  bodyParser = require('body-parser'),
  http = require('http'),
  routes = require('./routes'),
  debug = require('debug'),
  sassMiddleware = require('node-sass-middleware'),
  path = require('path');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 80;

// Disable etag headers on responses
app.disable('etag');

// Set /public as our static content dir
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public/assets/sass'),
    dest: path.join(__dirname, 'public/assets/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css',
  })
);

app.use('/', express.static(path.join(__dirname, 'public/assets')));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb'}));

// Index Route
app.get('/', routes.home);
app.get('/live', routes.live);

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port,'0.0.0.0', function() {
  console.log('Express server listening on port ' + port);
});
