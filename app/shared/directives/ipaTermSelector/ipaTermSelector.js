sharedApp.directive('ipaTermSelector', function($window, $location, $routeParams, $rootScope, authService) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'ipaTermSelector.html', // directive html found here:
		replace: true, // Replace with the template below
		scope: {},
		link: function (scope, element, attrs) {
			scope.year = $routeParams.year;
			scope.workgroupId = $routeParams.workgroupId;
			scope.termShortCode = $routeParams.termShortCode;

			scope.generateDisplayText = function() {
				var description = scope.termShortCode.getTermDisplayName();
				if (description && description.length > 0) {
					return description;
				} else {
					return "Annual";
				}
			};

			scope.gotoPreviousTerm = function() {
				var allTerms = ['05','06','07','08','09','10','01','02','03'];
				var currentTerm = scope.termShortCode;
				var index = allTerms.indexOf(currentTerm);

				var previousTerm = allTerms[index - 1];

				var url = $location.absUrl();

				n = url.lastIndexOf(currentTerm);
				if (n > -1) {
					url = url.substring(0, n) + previousTerm + url.substring(n+2, url.length);
				}

				$window.location.href = url;
			};

			scope.gotoNextTerm = function() {
				var allTerms = ['05','06','07','08','09','10','01','02','03'];
				var currentTerm = scope.termShortCode;
				var index = allTerms.indexOf(currentTerm);

				var nextTerm = allTerms[index + 1];

				var url = $location.absUrl();

				n = url.lastIndexOf(currentTerm);
				if (n > -1) {
					url = url.substring(0, n) + nextTerm + url.substring(n+2, url.length);
				}

				$window.location.href = url;
			};
		} // End Link
	};
});