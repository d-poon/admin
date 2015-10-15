var mongoose = require('mongoose');

var schema = mongoose.Schema;

var quizSchema = new schema({
	name: String,
	tour: String,
	questions: [{question: String, answers: [String]}]
});

module.exports = mongoose.model('Quiz',quizSchema);