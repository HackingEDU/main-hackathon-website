// Require our dependencies
var express = require('express'),
  bodyParser = require('body-parser'),
  http = require('http'),
  //twitter = require('twitter'),
  routes = require('./routes'),
  //config = require('./config'),
  // streamHandler = require('./utils/streamHandler'),
  debug = require('debug'),
  sassMiddleware = require('node-sass-middleware'),
  path = require('path');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 80;

// Disable etag headers on responses
app.disable('etag');


// Create a new ntwitter instance
//var twit = new twitter(config.twitter);

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
app.get('/signup', routes.signup);
app.get('/live', routes.live);
app.post('/new_user', routes.newUser);
app.get('/unsubscribe', routes.unsubscribe);




// Page Route
app.get('/page/:page/:skip', routes.page);

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port,'0.0.0.0', function() {
  console.log('Express server listening on port ' + port);
});

// Initialize socket.io
// var io = require('socket.io').listen(server);

// io.on('connection', function(socket) {
//   socket.on('get_tweets', function(data) {
//     twit.get('search/tweets', {q: 'hackingedu OR hackingedusf'}, function(error, tweets, response){
//       //add error handling later
//       var statuses = tweets.statuses;
//       if (statuses.length > data.amount) {
//         statuses = statuses.slice(0, data.amount);
//       }
//       socket.emit('tweet_search_results', statuses);
//     });
//   });
// });

// Set a stream listener for tweets matching tracking keywords
// twit.stream('statuses/filter',{ track: 'hackingedu, hackingedusf'}, function(stream){
//   streamHandler(stream,io);
// });
