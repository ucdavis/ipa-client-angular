sharedApp.directive('noMobileSupport', function($window, $location, $routeParams, $rootScope) {
	return {
		restrict: 'E', // Use this via an element selector <no-mobile-support></no-mobile-support>
		templateUrl: 'noMobileSupport.html', // directive html found here:
		replace: true, // Replace with the template below
		scope: {},
		link: function (scope, element, attrs) {

		} // End Link
	};
});