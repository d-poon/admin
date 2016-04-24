var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var config = require('./config/serverConfig');
var routes = require('./server/routes/index');

var app = express();


//Mongoose setup
mongoose.connect(config.db, function(err){
	if(err){
		console.log('Connection to database error', err);
	} else {
		console.log('Connection to database successful');
	}
});


//Morgan
app.use(morgan('dev'));
//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false 
}));

//Set public folder as static path
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api', routes); //API routing
app.get('*', function(req,res){
	res.sendFile('index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(config.port);
console.log("Server listening on port " + config.port +"\n");