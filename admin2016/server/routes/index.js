var express = require('express');
var router = express.Router();
var passport = require('passport');

router.use('/sites',require('./siteRoutes')); //Includes the routes in the siteRoutes.js in the routes folder
router.use('/quizzes',require('./quizRoutes')); //Includes all routes associated with quiz in quizRoutes.js
router.use('/users', require('./userRoutes')); //Includes all routes for users in userRoutes.js

//Status of authenticate
router.get('/status', function(req, res){
	if(!req.isAuthenticated()){
		return res.status(200).json({
			status: false
		});
	}
	res.status(200).json({
		status: true
	});
});

//View Admins, returns json of all admin accounts in database
router.get('/viewAdmins', function(req, res){
	AdminUser.find(function(err, admins){
		if(err) 
			res.send(err);
		res.json(admins);
	});
});

//Update Password, uses Passport-local-mongoose function setPassword to change password
router.put('/updatePassword', function(req, res){
	AdminUser.findOne({_id: req.body._id}, function(err, user){
		if(err)
			res.send(err);
		user.setPassword(req.body.password, function(err){
			if(err)
				res.send(err);
			user.save();
			res.end();
		});
	});
});

//Remove Admin, remove admin by admin user's _id
router.delete('/removeAdmin/:adminID',function(req, res){
	var aID= req.params.adminID;
	AdminUser.remove({_id:aID},function(err,admin){
		if(err)
			res.send(err)
		res.end();
	});
});

/*
	Below functions based on authentication from http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/
*/

//Register, creates a new Admin User account and authenticates it
router.post('/register', function(req, res){
	AdminUser.register(new AdminUser({username: req.body.username}), req.body.password, function(err, account) {
		if(err){
			return res.status(500).json({
				err: err
			});
		}
		passport.authenticate('local')(req, res, function(){
			return res.status(200).json({
				status: 'Registration successful'
			});
		});
	});
});

// Login, checks status of logging in account
router.post('/login', function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){
			return next(err);
		}
		if(!user){
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err) {
			if(err){
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}
			res.status(200).json({
				status: 'Login successful!'
			});
		});
	})(req, res, next);
});

//Logout, logout function
router.get('/logout', function(req, res){
	req.logout();
	res.status(200).json({
		status: 'Bye!'
	});
});

module.exports = router;
