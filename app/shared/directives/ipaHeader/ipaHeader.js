let ipaHeader = function ($window, $location, $rootScope, AuthService, $routeParams) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		template: require('./ipaHeader.html'), // directive html found here:
		replace: true, // Replace with the template below
		transclude: true,
		link: function (scope, element, attrs) {
			scope.pageTitle = attrs.pageTitle;
			scope.greetings = ["Hello", "Greetings", "Howdy", "Hi", "Welcome"];
			scope.greeting = scope.greetings[Math.floor(Math.random() * scope.greetings.length)];

			scope.impersonate = function(loginId) {
				AuthService.impersonate(loginId);
			};

			scope.unImpersonate = function() {
				AuthService.unimpersonate();
			};

			// Will navigate to the summary page of the specified workgroup, on the same year
			scope.changeWorkgroup = function(originalWorkgroupId, newWorkgroupId) {
				var originalWorkgroupId = originalWorkgroupId.toString();
				var newWorkgroupId = newWorkgroupId.toString();
				var year = $routeParams.year;
				var url = "/summary/" + newWorkgroupId + "/" + year;

				$window.location.href = url;
			};

			scope.loadWorkgroupPage = function(workgroupId) {
				if (!scope.year) {
					scope.year = "";
				}

				$window.location.href = "/workgroups/" + workgroupId + "/" + scope.year;
			};
		}
	};
};

export default ipaHeader;