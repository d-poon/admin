var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var adminUser = new Schema({
  username: String,
  password: String
});

adminUser.plugin(passportLocalMongoose);

module.exports = mongoose.model('AdminUser', adminUser);