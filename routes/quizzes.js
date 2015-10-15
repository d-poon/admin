var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Quiz = require('../models/Quiz.js');

router.get('/', function(req, res, next){
	Quiz.find(function(err, todos){
		if(err) return next(err);
		res.render('quizzes');
	});
});

router.post('/', function(req, res, next){
	var quiz = new Quiz();
	Quiz.create(req.body, function(err, post){
		if(err) return next(err);
		res.render('addQuiz');
	})
})

module.exports = router;