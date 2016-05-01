angular.module('adminCtrl',[])
	/*
		Site Controllers
	*/
	.controller('siteViewCtrl', ['$scope', '$http', '$route', '$location', '$routeParams','Site', 'Share', 'Quiz', function($scope, $http, $route, $location, $routeParams, Site, Share, Quiz){
		$scope.siteData = {};
		Site.get()
			.success(function(data){
				$scope.siteData = data;
				angular.forEach($scope.siteData, function(site){
					Quiz.getOne((site.idno).toString())
						.success(function(data){
							site.quizName = data[0].name;
						});
				});
			});

		$scope.editSite = function(site){
			Share.set(site);
			$location.path('/site/edit');
		};
		$scope.removeSite = function(title){			
			Site.remove(title);
			$route.reload();			
		};
	}])
	.controller('siteAddCtrl', ['$scope', '$http', 'Site', 'Quiz', function($scope, $http, Site, Quiz){
		$scope.formData = {};
		$scope.formData.picData = [];
		$scope.filenames = [];
		Quiz.get()
			.success(function(data){
				$scope.quizData = data;
			});
		
		$scope.addImg = function(){
			$scope.formData.picData.push({});		
		}
		
		$scope.submitForm = function() {
			var data = $scope.formData;
			var types = [];
			var file, fd, filename;
			var picArr = [];
			for(var i = 0; i < data.picData.length; i++){
				file = $scope.formData.picData[i].file;
				fd = new FormData();
				fd.append('file', file);
				Site.upload(fd);
				filename = "img/"+$scope.filenames[i];
				picArr.push({
						src: filename,
						description: data.picData[i].description,
						technicaldescription: data.picData[i].technical
					});
			}
			data.pics = picArr;	
						
			if(data.type.general){
				types.push("general");
			}
			if(data.type.shortType){
				types.push("short");
			}
			if(data.type.concrete){
				types.push("concrete");
			}
			if(data.type.steel){
				types.push("steel");
			}
			if(data.type.timber){
				types.push("timber");
			}
			if(data.type.connections){
				types.push("connections");
			}
			if(data.type.lateral){
				types.push("lateral");
			}
			data.type = types;
			if(!data.lat){
				data.lat = "38.5651845";
			}
			if(!data.lon){
				data.lon = "-121.4170459";
			}
			
			data.quizID = $scope.quizID;
			
			Site.create(data);
			angular.element("input[type='file']").val(null);
			$scope.formData = {};
			$scope.quizID = {};
		}
		
	}])
	.controller('siteEditCtrl', ['$scope', '$http', '$filter', 'Site','Quiz', 'Share', function($scope,$http,$filter,Site,Quiz,Share){
		$scope.formData = {};
		var data = Share.get(); //From View Controller
		var dataTypes = data.tourtype;
		var scopeTypes = {};
		Quiz.get()
			.success(function(data){
				$scope.quizData = data;
			});
		for(var i = 0; i < dataTypes.length; i++){
			if(dataTypes[i].toLowerCase() == "general"){
				scopeTypes.general = true;
			}else if(dataTypes[i].toLowerCase() == "short"){
				scopeTypes.shortType = true;
			}else if(dataTypes[i].toLowerCase() == "concrete"){
				scopeTypes.concrete = true;
			}else if(dataTypes[i].toLowerCase() == "steel"){
				scopeTypes.steel = true;
			}else if(dataTypes[i].toLowerCase() == "timber"){
				scopeTypes.timber = true;
			}else if(dataTypes[i].toLowerCase() == "connections"){
				scopeTypes.connections = true;
			}else if(dataTypes[i].toLowerCase() == "lateral"){
				scopeTypes.lateral = true;
			}
		}
		$scope.formData.idno = data.idno;
		$scope.formData.title = data.title;
		$scope.formData.types = scopeTypes;	
		$scope.formData.lat = data.lat;
		$scope.formData.lon = data.lon;
		$scope.formData.description = data.description;
		$scope.formData.technical = data.technicaldescription;
		$scope.formData.oldPicData = data.pics;
		$scope.formData.newPicData = [];
		$scope.filenames = [];
		
		$scope.removeImg = function(data){
			var notSrc = '!' + data;
			$scope.formData.oldPicData = $filter('filter')( $scope.formData.oldPicData, {src: notSrc});
		}
		$scope.addImg = function(){
			$scope.formData.newPicData.push({});		
		}
		$scope.saveForm = function(){
			var scopeData = $scope.formData;
			var types = [];
			
			var file, fd, filename;
			var picArr = [];
			for(var i = 0; i < scopeData.oldPicData.length; i++){
				picArr.push({
						src: scopeData.oldPicData[i].src,
						description: scopeData.oldPicData[i].description,
						technicaldescription: scopeData.oldPicData[i].technicaldescription
					});
			}
			
			for(var i = 0; i < scopeData.newPicData.length; i++){
				file = scopeData.newPicData[i].file;
				fd = new FormData();
				fd.append('file', file);
				Site.upload(fd);
				filename = "img/"+$scope.filenames[i];
				picArr.push({
						src: filename,
						description: scopeData.newPicData[i].description,
						technicaldescription: scopeData.newPicData[i].technicaldescription
					});	
			}		
			
			scopeData.pics = picArr;
			
			if(scopeData.types.general){
				types.push("general");
			}
			if(scopeData.types.shortType){
				types.push("short");
			}
			if(scopeData.types.concrete){
				types.push("concrete");
			}
			if(scopeData.types.steel){
				types.push("steel");
			}
			if(scopeData.types.timber){
				types.push("timber");
			}
			if(scopeData.types.connections){
				types.push("connections");
			}
			if(scopeData.types.lateral){
				types.push("lateral");
			}
			scopeData.type = types;
			if(!scopeData.lat){
				scopeData.lat = "38.5651845";
			}
			if(!scopeData.lon){
				scopeData.lon = "-121.4170459";
			}			
			
			scopeData.quizID = $scope.quizID;
			
			Site.update(scopeData);
			$scope.formData = {};
			$scope.quizID = {};
		}
	}])
	/*
		Quiz Controllers
	*/
	.controller('quizViewCtrl', ['$scope', '$http', '$route', '$location', 'Quiz','Share', function($scope, $http, $route, $location, Quiz, Share){
		$scope.quizData = {};
		Quiz.get()
			.success(function(data){
				$scope.quizData = data;
			});
		$scope.editQuiz = function(quiz){
			Share.set(quiz);
			$location.path('/quiz/edit');
		};
		$scope.removeQuiz = function(id){		
			Quiz.remove(id);
			$route.reload();			
		};
	}])
	.controller('quizAddCtrl', ['$scope', '$http', 'Quiz', function($scope, $http, Quiz){
		$scope.formData = {};
		$scope.formData.questions = [];
		
		$scope.addQuestion = function(){
			$scope.formData.questions.push({});		
		}
		
		$scope.submitForm = function() {
			var data = $scope.formData;
			for(var i = 0; i < data.questions.length; i++){
				data.questions[i].options = [];
				data.questions[i].options.push(data.questions[i].answer1);
				data.questions[i].options.push(data.questions[i].answer2);
				data.questions[i].options.push(data.questions[i].answer3);
				data.questions[i].options.push(data.questions[i].answer4);
				data.questions[i].options.push(data.questions[i].answer5);
			}
			Quiz.create(data);
			$scope.formData = {};	
		}
	}])
	.controller('quizEditCtrl', ['$scope', '$http', 'Quiz', 'Share', function($scope, $http, Quiz, Share){
		$scope.quizData = {};
		var data = Share.get();
		$scope.quizData._id = data._id
		$scope.quizData.name = data.name;
		$scope.quizData.questions = data.questions;
		
		$scope.addQuestion = function() {
			$scope.quizData.questions.push({});
		}
		
		$scope.saveForm = function() {
			var editData = $scope.quizData;
			Quiz.update(editData);
			$scope.quizData = {};	
		}
	}])
	/*
		User Controllers
	*/
	.controller('userViewCtrl', ['$scope', '$http', '$route', '$location', 'User','Quiz', function($scope, $http, $route, $location, User, Quiz){
		$scope.userData = {};
		$scope.sortType = 'username';
		$scope.sortReverse = false;
		
		User.get()
			.success(function(data){
				$scope.userData = data;
				angular.forEach($scope.userData, function(user){
					angular.forEach(user.quizzes,function(quiz){
						Quiz.getOne(quiz.quizId)
							.success(function(data){
								quiz.name = data[0].name;
							});
					});
				});
			});
		
		$scope.checkAll = function(){
			if($scope.selectAll){
				$scope.selectAll = true;
			}else{
				$scope.selectAll = false;
			}
			angular.forEach($scope.userData, function(user){
				user.selected = $scope.selectAll;
			});
		}
	}])
	/*
			File Model Directive
	
	*/
	.directive('fileModel', ['$parse', function($parse){ //Directive for file upload taken from http://stackoverflow.com/questions/32957006/nodejs-multer-angularjs-for-uploading-without-redirecting
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function(){
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
						scope.filenames.push(element[0].files[0].name); //Send filename to $scope.filenames array
					});
				});			
			}
		};
	}]);