let ipaTermSelector = function($window, $location, $routeParams, $rootScope) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		template: require('./ipaTermSelector.html'), // directive html found here:
		replace: true, // Replace with the template below
		scope: {},
		link: function (scope, element, attrs) {
			scope.year = $routeParams.year;
			scope.workgroupId = $routeParams.workgroupId;
			scope.termShortCode = $routeParams.termShortCode;
			scope.currentEndHref = $location.path().split('/').pop();

			// Term navigation is disabled in read only mode
			scope.readOnlyMode = false;

			// Instructor/SupportStaff forms should not allow for term navigation
			if (scope.currentEndHref == "instructorSupportCallForm"
			|| scope.currentEndHref == "studentSupportCallForm") {
					scope.readOnlyMode = true;
				}

			// Generates display text for the center of the term selector
			scope.generateDisplayText = function() {
				if (!scope.termShortCode || scope.termShortCode.length != 2) {
					return "Annual";
				}

				var description = scope.termShortCode.getTermDisplayName();
				if (description && description.length > 0) {
					return description;
				} else {
					return "Annual";
				}
			};

			// Used by previous term UI button
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

			// Controls next term UI button
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
};

export default ipaTermSelector;
