angular.module('adminService',[])
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
	.factory('User', ['$http', function($http){
		return {
			get : function() {
				return $http.get('/api/users/view');
			}
		}
	}]);
