var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({
    idnum: Number,
	name: String,
    questions: 
        [{
            question: String,
			choices: [String],
			answer: Number
        }]   
},
{
	collection: 'quizzes'
});

module.exports = mongoose.model('Quiz', QuizSchema);