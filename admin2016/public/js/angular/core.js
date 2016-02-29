var adminApp = angular.module('adminApp', ['ngRoute','adminCtrl', 'adminService']);
adminApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl : 'views/home.html',
			controller : 'mainCtrl'
		})
		.when('/addQuiz', {
			templateUrl : 'views/addQuiz.html',
			controller : 'quizCtrl'
		});
	// Use HTML5 History API, Removes # from url
	$locationProvider.html5Mode(true);
}]);