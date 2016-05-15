var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//Public variable for AdminUser Mongodb model
AdminUser = require('./server/models/adminUser.js');

var config = require('./config/serverConfig');
var routes = require('./server/routes/index.js');

var app = express();

//Mongoose setup
mongoose.connect(config.db, function(err){
	if(err){
		console.log('Connection to database error', err);
	} else {
		console.log('Connection to database successful');
	}
});

//Environments
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
	secret: 'adminSecured',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Set public folder as static path
app.use(express.static(path.join(__dirname, 'public')));

//Passport config
passport.use(new localStrategy(AdminUser.authenticate()));
passport.serializeUser(AdminUser.serializeUser());
passport.deserializeUser(AdminUser.deserializeUser());

//Routes
app.use('/api', routes); 
app.get('*', function(req,res){
	res.sendFile('index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Start server on port
app.listen(config.port);
console.log("Server listening on port " + config.port +"\n");