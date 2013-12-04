var wayoApp = angular.module('wayoApp', [
	'ngRoute',
	'wayoControllers'
]);

wayoApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
		when('/login',{
			templateUrl: 'partials/front-page.html',
			controller: 'LoginCtrl'
		}).
		when('/home', {
			templateUrl: 'partials/home-page.html',
			controller: 'HomeCtrl'
		}).
		otherwise({
			redirectTo: '/login'
		});
	}]);