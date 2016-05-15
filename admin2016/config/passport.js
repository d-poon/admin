var LocalStrategy = require('passport-local').Strategy;
var AdminUser = require('../server/models/adminUsers');

module.exports = function(passport){
	passport.serializeUser(function(user,done){
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done){
		AdminUser.findById(id, function(err, user){
			done(err, user);
		});
	});
	passport.use('signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done){
		process.nextTick(function(){
			User.findOne({'username' : username}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
				} else {
					var newAdminUser = new AdminUser();
					newAdminUser.username = username;
					newAdminUser.password = newAdminUser.generateHash(password);
					
					newAdminUser.save(function(err){
						if(err)
							throw err;
						return done(null, newAdminUser);
					});
				}
			});
		});
	}));
}