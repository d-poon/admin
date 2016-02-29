var express = require('express');
var router = express.Router();

router.use('/sites',require('./siteRoutes')); //Includes the routes in the siteRoutes.js in the routes folder
router.use('/quizzes',require('./quizRoutes')); //Includes all routes associated with quiz in quizRoutes.js

/* Load the home api page. */
router.get('/', function(req, res) {
	res.json({
		message: 'API Index Page'
	});
});


module.exports = router;
