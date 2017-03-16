sharedApp.directive('ipaHeader', function($location, $rootScope, authService) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'ipaHeader.html', // directive html found here:
		replace: true, // Replace with the template below
		link: function (scope, element, attrs) {

			scope.impersonate = function(loginId) {
				authService.impersonate(loginId);
			};

			scope.unImpersonate = function() {
				authService.unimpersonate();
			};
		}
	};
});