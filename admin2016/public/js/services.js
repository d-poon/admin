angular.module('adminService',[])
	/*
		Login Service
		Majority of authentication code taken from: http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/
	*/
	.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http){
		var user = null;
		
		return ({
			isLoggedIn: isLoggedIn,
			getUserStatus: getUserStatus,
			login: login,
			logout: logout,
			register: register,
			//Function to retrieve admin users from server
			getAdmins: function() {
				return $http.get('/api/viewAdmins');
			},
			//Function to delete admin users from server
			removeAdmin: function(id){
				return $http.delete('/api/removeAdmin/'+id);
			},
			//Function to update admin users' passwords on the server
			updatePassword: function(user){
				return $http.put('/api/updatePassword', user);
			}
		});
		
		function isLoggedIn(){
			if(user){
				return true;
			}else{
				return false;
			}
		}
		function getUserStatus(){
			return $http.get('/api/status')
				.success(function(data){
					if(data.status){
						user = true;
					} else {
						user = false;
					}
				})
				.error(function(data){
					user = false;
				});
		}
		function login(username, password){
			var deferred = $q.defer();
			$http.post('/api/login', {username: username, password: password})
				.success(function(data, status){
					if(status === 200 && data.status){
						user = true;
						deferred.resolve();
					} else{
						user = false;
						deferred.reject();
					}
				})
				.error(function(data){
					user = false;
					deferred.reject();
				});
			return deferred.promise;
		}
		
		function logout(){
			var deferred = $q.defer();
			$http.get('/api/logout')
				.success(function(data){
					user = false;
					deferred.resolve();
				})
				.error(function(data){
					user = false;
					deferred.reject();
				});
			return deferred.promise;
		}
		
		function register(username, password){
			var deferred = $q.defer();
			$http.post('/api/register',	{username: username, password: password})
				.success(function(data, status){
					if(status ===  200 && data.status){
						deferred.resolve();
					}else{
						deferred.reject();
					};
				})
				.error(function(data){
					deferred.reject();
				});
			return deferred.promise;
		}
	}])
	// Site Service
	.factory('Site', ['$http', function($http){ 
		return {
			get : function() {
				return $http.get('/api/sites/view');
			},
			create : function(siteData) {
				return $http.post('/api/sites/add', siteData);
			},
			update : function(siteData){
				return $http.put('/api/sites/update',siteData);
			},
			remove : function(title){
				return $http.delete('/api/sites/remove/'+title);
			},
			upload : function(fd){
				return $http.post('/api/sites/uploadImg', fd,{
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					});
			}
		}
	}])
	// Share Data Service
	.factory('Share', function(){
		var savedData = {};
		function set(data){
			savedData = data;
		}
		function get() {
			return savedData;
		}
		return {
			set: set,
			get: get
		}
	})
	// Quiz Service
	.factory('Quiz', ['$http', function($http){
		return {
			get : function() {
				return $http.get('/api/quizzes/view');
			},
			getOne : function(id) {
				return $http.get('/api/quizzes/viewOne/'+id);
			},
			create : function(quizData) {
				return $http.post('/api/quizzes/add', quizData);
			},
			update : function(quizData){
				return $http.put('/api/quizzes/update',quizData);
			},
			remove : function(id){
				return $http.delete('/api/quizzes/remove/'+id);
			}
		}
	}])
	// User Service
	.factory('User', ['$http', function($http){
		return {
			get : function() {
				return $http.get('/api/users/view');
			},
			remove : function(id){
				return $http.delete('/api/users/remove/'+id);
			}
		}
	}]);
