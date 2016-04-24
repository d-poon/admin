var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var QuizSchema = new Schema({
    idno: Number,
	name: String,
    questions:
        [{
            question: String,
			options: [String],
			answer: Number,
            hint : String
        }]
});


module.exports = mongoose.model('Quiz', QuizSchema);