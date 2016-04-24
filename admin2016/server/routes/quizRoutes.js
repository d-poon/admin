var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quiz = require('../models/quizzes.js');

router.get('/view', function(req, res){ 
	Quiz.find(function(err, quiz){
		if(err)
			res.send(err);
		res.json(quiz); //Render json to view all quizzes
	});
});

router.get('/viewOne/:quizID', function(req, res){
	var qID = req.params.quizID; //Get _id of the quiz
	Quiz.find({_id:qID}, function(err,quiz){
		if(err)
			res.send(err);
		res.json(quiz);
	});
});

router.post('/add', function(req, res){
	var quiz = new Quiz(); //Make new quiz
	
	quiz.name = req.body.name; 
	quiz.questions.question = req.body.question;
	quiz.questions.options.push(req.body.answer1);
	quiz.questions.options.push(req.body.answer2);
	quiz.questions.options.push(req.body.answer3);
	quiz.questions.options.push(req.body.answer4);
	quiz.questions.options.push(req.body.answer5);
	quiz.questions.answer = req.body.answerKey;
	quiz.questions.hint = req.body.hint;
	//Save to database
	quiz.save(function(err){
		if(err)
			res.send(err);
		res.send("Quiz Saved to Database");
	});
});

router.put('/update', function(req,res){
	Quiz.update(
		{_id:req.body._id},
		{$set: {
			name:req.body.name,
			questions:req.body.questions
		}},
		function(err,quiz){
			if(err)
				res.send(err)
			res.send("Quiz Updated");
		});
});

router.delete('/remove/:quizID', function(req, res){
	var qID = req.params.quizID; //Get _id of the quiz
	Quiz.remove({_id:qID}, function(err,quiz){
		if(err)
			res.send(err);
		res.send("Quiz Deleted");
	});
});

module.exports = router;