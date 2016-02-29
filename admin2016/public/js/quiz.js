/**
 * Created by Edgar on 10/14/15.
 *
 */
Quiz = function(quizName, tourID){
    //Name of the quiz
    this.quizName = quizName;
    //The tour that the quiz is associated with
    this.tourID = tourID;
    this.questions = []
    this.answers = [];
    this.answerKeys = [];
};

//Adds the question and answer key to the object
Quiz.prototype.addQuestion = function (questionName, answers, key) {
    this.questions.push(questionName);
    this.answers.push(answers);
    this.answerKeys.push(key);
};

Quiz.prototype.editQuestion = function(questionName, answers, key, index){
	this.questions[index] = questionsName;
	this.answers[index] = answers;
	this.key[index] = answers;
};

//Returns the name of the quiz
Quiz.prototype.getQuizName = function(){
    return this.quizName;
};

//Returns the id that this quiz is associated with
Quiz.prototype.getTourID = function(){
    return this.tourID;
}

//Returns the array of question
Quiz.prototype.getQuestions = function(){
    return this.questions;
};

Quiz.prototype.getAnswers = function() {
	return this.answers;
}

//Returns the array of answer keys
Quiz.prototype.getAnswerKeys = function(){
    return this.answerKeys;
};
