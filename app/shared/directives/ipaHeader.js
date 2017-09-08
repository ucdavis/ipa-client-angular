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

			// Will navigate to the summary page of the specified workgroup, on the same year
			scope.changeWorkgroup = function(originalWorkgroupId, newWorkgroupId) {
				var originalWorkgroupId = originalWorkgroupId.toString();
				var newWorkgroupId = newWorkgroupId.toString();

				var explodedUrl = $location.absUrl().split('/');
				var workgroupIndex = explodedUrl.indexOf(originalWorkgroupId);
				var year = explodedUrl[workgroupIndex + 1].split('?')[0];
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
});