var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users.js');

router.get('/view', function(req, res){ 
	User.find(function(err, users){
		if(err)
			res.send(err);
		res.json(users); //Render json to view all users
	});
});

module.exports = router;