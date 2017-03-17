sharedApp.directive('ipaTermSelector', function($location, $rootScope, authService) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'ipaTermSelector.html', // directive html found here:
		replace: true, // Replace with the template below
		scope: {},
		link: function (scope, element, attrs) {

		}
	};
});