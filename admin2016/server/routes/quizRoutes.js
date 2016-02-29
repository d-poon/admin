var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quiz = require('../models/quizzes.js');

router.get('/view', function(req, res){ 
	var quiz = Quiz.find(function(err, quiz){
		if(err)
			res.send(err);
		res.json({quizzes: quiz}); //Render json to view all quizzes
	});
});
/*
router.get('/addQuiz', function(req, res){
	//res.render('addQuiz'); //Render Edgar's page to add a quiz
});
*/
router.post('/add', function(req, res){
	var quiz = new Quiz(); //Make new quiz
	quiz.name = req.body.name; //Get quiz name from post
	
	/*Parse input from quizHelper*/
	var questions = JSON.parse(req.body.questions);
	var answers = JSON.parse(req.body.answers);
	var answerKeys = JSON.parse(req.body.answerKeys);
	
	//Input to subDocument of Quiz
	for(var i = 0; i < questions.length;i++){
		quiz.questions.push({question : questions[i], choices : answers[i],answer : answerKeys[0]});
	};
	//Save to database
	quiz.save(function(err){
		if(err)
			res.send(err);
	});
});
router.post('/delete', function(req, res){
	var qID = req.body.quizID; //Get _id of the quiz
	Quiz.findById(qID,function(err, quiz){ //Find by _id
		if (err) 
			res.send(err);
		quiz.remove(); //Remove the quiz from collection
	});
	//res.redirect('/viewQuizzes'); //Redirect back to 
});
router.post('/edit', function(req, res){
	var qID = req.body.quizID; //Get _id of quiz
	Quiz.findById(qID,function(err, aQuiz){ // Find by _id
		if (err) 
			res.send(err);
		//Render editQuiz.jade, passing it the quiz in quiz, and the script to create a quiz object
		//res.render('editQuiz', {quiz: aQuiz, redirect:'/viewQuizzes'}); //script:['javascripts/editQuiz.js']});  
	});
});
/*
router.put('/editQuiz', function(req, res){
	console.log(req.body.name);
});
*/

module.exports = router;