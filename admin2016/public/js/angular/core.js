var adminApp = angular.module('adminApp', ['ngRoute','adminCtrl', 'adminService']);
adminApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	// Use HTML5 History API, Removes # from url
	$locationProvider.html5Mode(true).hashPrefix('!');
	
	$routeProvider
		.when('/', {
			templateUrl : 'views/home.html'
		})
		.when('/quiz/view', {
			templateUrl : 'views/viewQuiz.html',
			controller : 'quizViewCtrl'
		})
		.when('/quiz/add', {
			templateUrl : 'views/addQuiz.html',
			controller : 'quizAddCtrl'
		})
		.when('/quiz/edit', {
			templateUrl : 'views/editQuiz.html',
			controller : 'quizEditCtrl'
		})
		.when('/site/view', {
			templateUrl : '/views/viewSite.html',
			controller : 'siteViewCtrl'
		})
		.when('/site/add', {
			templateUrl : '/views/addSite.html',
			controller : 'siteAddCtrl'
		})
		.when('/site/edit', {
			templateUrl : '/views/editSite.html',
			controller : 'siteEditCtrl'
		})
		.when('/user/view',{
			templateUrl : '/views/viewUser.html',
			controller : 'userViewCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

		