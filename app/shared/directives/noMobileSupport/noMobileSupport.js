let noMobileSupport = function($window, $location, $routeParams, $rootScope) {
	return {
		restrict: 'E', // Use this via an element selector <no-mobile-support></no-mobile-support>
		template: require('./noMobileSupport.html'), // directive html found here:
		replace: true, // Replace with the template below
		scope: {},
		link: function () {
			// do nothing
		}
	};
};

export default noMobileSupport;
