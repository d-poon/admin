var adminApp = angular.module('adminApp', ['ngRoute','adminCtrl', 'adminService']);
adminApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
	// Use HTML5 History API, Removes # from url
	$locationProvider.html5Mode(true).hashPrefix('!');
	
	//Angular routing, controller pairing, and authentication
	$routeProvider
		.when('/', { //Login page at '/'
			templateUrl : 'views/login.html',
			controller : 'loginCtrl',
			access: {restricted: false}
		})
		.when('/register/add', {
			templateUrl : 'views/register.html',
			controller : 'registerCtrl',
			access: {restricted: false}
		})
		.when('/register/update', {
			templateUrl : 'views/updatePassword.html',
			controller : 'updatePasswordCtrl',
			access: {restricted: true}
		})
		.when('/register/view', {
			templateUrl : 'views/viewAdmins.html',
			controller : 'viewAdminsCtrl',
			access: {restricted: true}
		})
		.when('/home', {
			templateUrl : 'views/home.html',
			access: {restricted: true}
		})
		.when('/quiz/view', {
			templateUrl : 'views/viewQuiz.html',
			controller : 'quizViewCtrl',
			access: {restricted: true}
		})
		.when('/quiz/add', {
			templateUrl : 'views/addQuiz.html',
			controller : 'quizAddCtrl',
			access: {restricted: true}
		})
		.when('/quiz/edit', {
			templateUrl : 'views/editQuiz.html',
			controller : 'quizEditCtrl',
			access: {restricted: true}
		})
		.when('/site/view', {
			templateUrl : '/views/viewSite.html',
			controller : 'siteViewCtrl',
			access: {restricted: true}
		})
		.when('/site/add', {
			templateUrl : '/views/addSite.html',
			controller : 'siteAddCtrl',
			access: {restricted: true}
		})
		.when('/site/edit', {
			templateUrl : '/views/editSite.html',
			controller : 'siteEditCtrl',
			access: {restricted: true}
		})
		.when('/user/view',{
			templateUrl : '/views/viewUser.html',
			controller : 'userViewCtrl',
			access: {restricted: true}
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
//Gets current location of routeProvider and sends to $rootScope, for hiding index.html's navigation on login page
adminApp.run(['$rootScope', '$location', '$route', 'AuthService', function($rootScope,$location,$route,AuthService){
	$rootScope.$on('$routeChangeSuccess', function(e, current, pre){
		//Hide navigation if current page on '/'
		$rootScope.isLoginPage = $location.path();
	});
	
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		//Check if user logged in, if not redirect to main '/' page
		AuthService.getUserStatus()
			.then(function(){
				if(next.access.restricted && !AuthService.isLoggedIn()){
					$location.path('/');
					$route.reload();
				};
			});
	});
	
	//Global logout function
	$rootScope.logout = function(){
		AuthService.logout()
			.then(function(){
				$location.path('/');
			});
	};
		
	//Function to toggle active navigation tab on main index.html navigation
	$rootScope.activeClass = function(path){
		//If current $location.path() prefix path is equal to path of link, then change the link style class to 'active' css class
		return ($location.path().substr(0, path.length) === path) ? 'active' : '';
	};
}]);

		