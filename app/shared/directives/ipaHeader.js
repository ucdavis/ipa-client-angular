sharedApp.directive('ipaHeader', function($window, $location, $rootScope, authService) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'ipaHeader.html', // directive html found here:
		replace: true, // Replace with the template below
		transclude: true,
		link: function (scope, element, attrs) {
			scope.pageTitle = attrs.pageTitle;
			scope.greetings = ["Hello", "Greetings", "Howdy", "Hi", "Welcome"];
			scope.greeting = scope.greetings[Math.floor(Math.random() * scope.greetings.length)];

			scope.impersonate = function(loginId) {
				authService.impersonate(loginId);
			};

			scope.unImpersonate = function() {
				authService.unimpersonate();
			};

			// Will generate a url for the current location, but substitube the passed in workgroupId where relevant
			scope.changeWorkgroup = function(originalWorkgroupId, newWorkgroupId) {
				var originalWorkgroupId = originalWorkgroupId.toString();
				var newWorkgroupId = newWorkgroupId.toString();

				var url = $location.absUrl();
				url = url.replace(originalWorkgroupId, newWorkgroupId);

				return url;
			};

			scope.loadWorkgroupPage = function(workgroupId) {
				if (!scope.year) {
					scope.year = "";
				}

				$window.location.href = "/workgroups/" + workgroupId + "/" + scope.year;
			};
		}
	};
});