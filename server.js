// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var api        = require('marvel-api');

var marvel = api.createClient({
  publicKey: '',
  privateKey: ''
});

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port
// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log( "Request : " + req.query.offset );
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/hero')

// get all the hero (accessed at GET http://localhost:8080/api/hero)
.get(function(req, res) {
  var limit = typeof req.query.limit !== 'undefined' ? req.query.limit : 20;
  var offset = typeof req.query.offset !== 'undefined' ? req.query.offset : 0;

  console.log( req.query.limit )
  marvel.characters.findAll( limit, offset )
  .then(function( payload ){
    //console.log( payload );
    res.json( payload );
  })
  .fail()
  .done();
});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
