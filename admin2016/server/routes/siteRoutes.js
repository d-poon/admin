var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Site = require('../models/site.js');

router.get('/', function (req,res){
	res.json({
		message : 'api options: view'
	});
});

router.get('/view',function(req, res){ //View all the sites
	var site = Site.find(function(err, sites){
		if(err) 
			res.send(err);
		res.json(sites);
	});
});
/*
router.get('/addSite',function(req, res){ //Links to createSite.html
	res.render('addSite');
});
*/
router.post('/add',function(req, res){ //Posts data from createSite.js
	var site = new Site();
	//site.idnum=req.body.idNum;
	site.tourtype=JSON.parse(req.body.type);
	site.title=req.body.name;
	site.lat=req.body.latitude;
	site.lon=req.body.longitude;
	site.description=req.body.description;
	site.technical=req.body.technical;
	site.pics=req.body.pics;
	
	site.save(function(err){
		if(err) 
			res.send(err);
	});
});
router.post('/delete',function(req, res){
	var sID = req.body.siteID; //Get _id of site
	Site.findById(sID,function(err,site){
		if(err)
			res.send(err);
		site.remove(); //Delete the site
	});
});
/*
router.post('editSite',function(req,res){
		
	//NOT IMPLEMENTED
	
	
	var sID = req.body.siteID; //Get _id of site
	Site.findbyId(sID,function(err, aSite){
		res.render('editQuiz',{site: aSite});
	});
});
*/

module.exports = router;