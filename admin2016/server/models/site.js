var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
    idnum: Number,
    tourtype: String,
    title: String,
	ratingCount: Number,
	ratings: [Number],
    avgRating: Number,
    icon: String,
    lat: Number,
    lon: Number,
    description: String,
    technical: String,
    pics: [
		{
			src: String
		}
	]
},
{
	collection: 'sites'
});


module.exports = mongoose.model('Site', SiteSchema);