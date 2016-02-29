angular.module('adminCtrl',[])
	.controller('mainCtrl', ['$scope', '$http', 'Site', function($scope, $http, Site){
		Site.get()
			.success(function(data){
				$scope.siteData = data;
			});
	}])
	.controller('quizCtrl', ['$scope', '$http', function($scope, $http){
		
	}]);