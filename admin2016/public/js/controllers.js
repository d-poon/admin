angular.module('adminCtrl',[])
	/*
		Login/Admin Account Controllers
		Authentication functions taken from http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/
	*/
	//Login
	.controller('loginCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
		//noAdmin == false if there exists an admin account
		$scope.noAdmin = false; 
		AuthService.getAdmins()
			.success(function(data){
				if(data.length < 1){
					//If no admin users, noAdmin set to true; Shows registration link on main page.
					$scope.noAdmin = true;
				} else {
					$scope.noAdmin = false;
				}
			});
		//Login button
		$scope.login = function(){
			$scope.error = false;
			$scope.disabled = true;
			AuthService.login($scope.loginForm.username, $scope.loginForm.password)
				.then(function(){
					$location.path('/home');
					$scope.errorMessage = '';
					$scope.disabled = false;
					$scope.loginForm = {};
				})
				.catch(function (){
					$scope.error = true;
					$scope.errorMessage = "Invalid username and/or password";
					$scope.disabled = false;
					$scope.loginForm = {};
				});
		};
	}])
	//Create Admin Account
	.controller('registerCtrl', ['$scope','$location','AuthService', function($scope,$location,AuthService) {
		//Register button
		$scope.register = function(){
			$scope.error = false;
			$scope.disabled = true;
			//Check if password and confirm password are the same
			if($scope.registerForm.password != $scope.registerForm.password2){
				$scope.error = true;
				$scope.errorMessage = "Passwords do not match!";
				$scope.registerForm = {};
			}else{
				//If passwords match, create account
				AuthService.register($scope.registerForm.username, $scope.registerForm.password)
				.then(function(){
					$scope.errorMessage = '';
					$scope.disabled = false;
					$scope.registerForm = {};
				})
				.catch(function (){
					$scope.error = true;
					$scope.errorMessage = "Something went wrong";
					$scope.disabled = false;
					$scope.registerForm = {};
				});
			}	
		};
	}])
	//Update Password
	.controller('updatePasswordCtrl', ['$scope', '$location', 'AuthService', 'Share', function($scope, $location, AuthService, Share){
		//Retrieve user object from Share sent by ViewAdminsCtrl
		$scope.updateForm = Share.get();
		$scope.error = false;
		//Update function call from AuthService
		$scope.update = function(){
			//Check if password and confirm password match
			if($scope.updateForm.password != $scope.updateForm.password2){
				$scope.error = true;
				$scope.errorMessage = "Passwords do not match!";
				$scope.updateForm = {};
			}else{
				//If they match set password as new password
				AuthService.updatePassword($scope.updateForm);
				$location.path('/register/view');
			}
		}
	}])
	//View Admin Accounts
	.controller('viewAdminsCtrl', ['$scope', '$route', '$location','AuthService', 'Share', function($scope, $route,$location, AuthService, Share){
		$scope.adminData = {};
		//Get AdminUser Accounts
		AuthService.getAdmins()
			.success(function(data){
				$scope.adminData = data;
				//Counter to track how much admin accounts are in database; If <= 1, hides delete button
				$scope.adminCount = data.length;
			});
		//Update function, transfer user json to updatePasswordCtrl
		$scope.update = function(user){
			Share.set(user);
			$location.path('/register/update');
		}
		//Delete function by _id
		$scope.removeAdmin = function(id){
			AuthService.removeAdmin(id);
			$route.reload();
		}
	}])
	/*
		Site Controllers
	*/
	// Site View Controller
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
	// Site Add Controller
	.controller('siteAddCtrl', ['$scope', '$http', 'Site', 'Quiz', function($scope, $http, Site, Quiz){
		$scope.formData = {};
		$scope.formData.picData = [];
		$scope.filenames = [];
		//Load quizzes from database into $scope.quizData
		Quiz.get()
			.success(function(data){
				$scope.quizData = data;
			});
		//Push blank object onto picData array to create more img loading inputs
		$scope.addImg = function(){
			$scope.formData.picData.push({});		
		}
		
		//Submit form function
		$scope.submitForm = function() {
			var data = $scope.formData;
			var types = [];
			var file, fd, filename;
			var picArr = [];
			//Upload images to img folder on server and push text details: filename & descriptions to array
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
			
			//Each of the tour type checkboxes converts to array of types to be sent to express
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
			//If no latitude or longitude provided, defaults to center of SacState 
			if(!data.lat){
				data.lat = "38.5651845";
			}
			if(!data.lon){
				data.lon = "-121.4170459";
			}
			//Selected quiz _id to link to this site
			data.quizID = $scope.quizID;
			//Create new site and reset all input fields
			Site.create(data);
			angular.element("input[type='file']").val(null);
			$scope.formData = {};
			$scope.quizID = {};
		}
		
	}])
	// Site Edit Controller
	.controller('siteEditCtrl', ['$scope', '$http', '$filter', 'Site','Quiz', 'Share', function($scope,$http,$filter,Site,Quiz,Share){
		$scope.formData = {};
		var data = Share.get(); //From View Controller
		var dataTypes = data.tourtype;
		var scopeTypes = {};
		//Get quizzes from database and store in $scope.quizData
		Quiz.get()
			.success(function(data){
				$scope.quizData = data;
			});
		//Loop to pre-fill tour type checkboxes
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
		//Initialize fields
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
		//Remove images from $scope.formData.oldPicData with $filter
		$scope.removeImg = function(data){
			var notSrc = '!' + data;
			$scope.formData.oldPicData = $filter('filter')( $scope.formData.oldPicData, {src: notSrc});
		}
		//Add new images onto newPicData array
		$scope.addImg = function(){
			$scope.formData.newPicData.push({});		
		}
		//Save edits
		$scope.saveForm = function(){
			var scopeData = $scope.formData;
			var types = [];
			
			var file, fd, filename;
			var picArr = [];
			//Loop appends remaining oldPicData onto new picArr array
			for(var i = 0; i < scopeData.oldPicData.length; i++){
				picArr.push({
						src: scopeData.oldPicData[i].src,
						description: scopeData.oldPicData[i].description,
						technicaldescription: scopeData.oldPicData[i].technicaldescription
					});
			}
			//Loop uploads new images and appends new image data to picArr array
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
			//Check if checkboxes are checked, and if true, push it onto types array
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
			
			//Default latitude and longitude if lat and lon fields empty, centered at SacState
			if(!scopeData.lat){
				scopeData.lat = "38.5651845";
			}
			if(!scopeData.lon){
				scopeData.lon = "-121.4170459";
			}			
			//Changes quizID to selected quiz _id 
			scopeData.quizID = $scope.quizID;
			
			//Update site, and clear form
			Site.update(scopeData);
			$scope.formData = {};
			$scope.quizID = {};
		}
	}])
	/*
		Quiz Controllers
	*/
	// Quiz View Controller
	.controller('quizViewCtrl', ['$scope', '$http', '$route', '$location', 'Quiz','Share', function($scope, $http, $route, $location, Quiz, Share){
		$scope.quizData = {};
		//Get all quizzes and store in $scope.quizData
		Quiz.get()
			.success(function(data){
				$scope.quizData = data;
			});
		//Edit quiz button, sends selected quiz object to quiz edit controller
		$scope.editQuiz = function(quiz){
			Share.set(quiz);
			$location.path('/quiz/edit');
		};
		//Deletes quiz and refreshes page
		$scope.removeQuiz = function(id){		
			Quiz.remove(id);
			$route.reload();			
		};
	}])
	// Quiz Add Controller
	.controller('quizAddCtrl', ['$scope', '$http', 'Quiz', function($scope, $http, Quiz){
		$scope.formData = {};
		$scope.formData.questions = [];
	
		//Push blank object onto questions array to create more question inputs
		$scope.addQuestion = function(){
			$scope.formData.questions.push({});		
		}
		//Create a quiz function
		$scope.submitForm = function() {
			var data = $scope.formData;
			//Load answer1-5 into options array
			for(var i = 0; i < data.questions.length; i++){
				data.questions[i].options = [];
				data.questions[i].options.push(data.questions[i].answer1);
				data.questions[i].options.push(data.questions[i].answer2);
				data.questions[i].options.push(data.questions[i].answer3);
				data.questions[i].options.push(data.questions[i].answer4);
				data.questions[i].options.push(data.questions[i].answer5);
			}
			//Create quiz and clear form
			Quiz.create(data);
			$scope.formData = {};	
		}
	}])
	// Quiz Edit Controller
	.controller('quizEditCtrl', ['$scope', '$http', 'Quiz', 'Share', function($scope, $http, Quiz, Share){
		$scope.quizData = {};
		//Retrieve quiz object from quiz view
		var data = Share.get();
		//Initialize form with retrieved data
		$scope.quizData._id = data._id
		$scope.quizData.name = data.name;
		$scope.quizData.questions = data.questions;
		
		//Push blank object onto questions array to create more question inputs
		$scope.addQuestion = function() {
			$scope.quizData.questions.push({});
		}
		//Save edits and clear form function
		$scope.saveForm = function() {
			var editData = $scope.quizData;
			Quiz.update(editData);
			$scope.quizData = {};	
		}
	}])
	/*
		User Controllers
	*/
	// User View Controller
	.controller('userViewCtrl', ['$scope', '$http', '$route', '$location', 'User','Quiz', function($scope, $http, $route, $location, User, Quiz){
		$scope.userData = {};
		$scope.sortType = 'username';
		$scope.sortReverse = false;
		
		// User get all users from server and fill in quiz names per user
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
		// Function to check all checkboxes
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
		// Function to delete all selected users
		$scope.deleteSelected = function(){
			angular.forEach($scope.userData, function(user){
				if(user.selected){
					User.remove(user._id);
				}
			});
			$route.reload();
		}
	}])
	/*
			File Model Directive for Image Uploading
	*/
	//Directive for file upload taken from http://stackoverflow.com/questions/32957006/nodejs-multer-angularjs-for-uploading-without-redirecting
	.directive('fileModel', ['$parse', function($parse){ 
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function(){
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
						//Send filename to $scope.filenames array
						scope.filenames.push(element[0].files[0].name); 
					});
				});			
			}
		};
	}]);