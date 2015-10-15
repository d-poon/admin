var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Quiz = require('../models/Quiz.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/viewQuizzes', function(req, res, next){
	Quiz.find(function(err, docs){
		if(err)
			res.send(err);
		res.render('quizzes', {quizzes: docs});
		console.log(docs);
	});
});
router.get('/addQuiz', function(req, res){
	res.render('addQuiz');
});

router.post('/postQuiz', function(req, res, next){
	var quiz = new Quiz();
	quiz.name = req.body.quizName;
	quiz.tour = req.body.tourName;
	quiz.save(function(err){
		if(err)
			res.send(err);
		console.log('quiz created');
		res.redirect('/viewQuizzes');
	});
});

module.exports = router;
