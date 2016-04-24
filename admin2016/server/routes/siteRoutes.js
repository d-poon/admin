var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');

var Tour = require('../models/tour.js');

var storage = multer.diskStorage({ //Multer storage config
	destination: function(req, file, cb){ //Upload images to public/img/
		cb(null, 'public/img/')
	},
	filename: function(req, file, cb){ //Keep originalname
		cb(null, file.originalname)
	}
});
var upload = multer({storage: storage}); //Multer

router.post('/uploadImg', upload.single('file')); //Upload single image with multer

router.get('/view',function(req, res){ //View all the sites
	Tour.find(function(err, sites){
		if(err) 
			res.send(err);
		res.json(sites);
	});
});

router.post('/add',function(req, res){ //Create site
	var	site = new Tour();
	site.idno=req.body.quizID;
	site.title=req.body.title;
	site.tourtype=req.body.type;
	site.lat=req.body.lat;
	site.lon=req.body.lon;
	site.rating=0;
	site.description=req.body.description;
	site.technicaldescription=req.body.technical;
	site.pics=req.body.pics;
	site.save(function(err){
		if(err) 
			res.send(err);
		res.end();
		});
});

router.put('/update',function(req, res){	//Update site
	Tour.update(
		{title:req.body.title},
		{$set: {
			idno:req.body.quizID,
			tourtype:req.body.type,
			lat:req.body.lat,
			lon:req.body.lon,
			description:req.body.description,
			technicaldescription:req.body.technical,
			pics:req.body.pics
		}},
		{multi: false},
		function(err,site){
			if(err)
				res.send(err)
			res.end();
		});
});

router.delete('/remove/:siteTitle',function(req, res){ //Remove site by site's title
	var sTitle= req.params.siteTitle;
	Tour.remove({title:sTitle},function(err,site){
		if(err)
			res.send(err)
		res.end();
	});
});


module.exports = router;