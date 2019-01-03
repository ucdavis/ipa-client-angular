let ipaTermSelectorDropdown  = function ($window, $location, $routeParams, $rootScope, Term) {
	return {
		restrict: 'E',
		template: require('./ipaTermSelectorDropdown.html'),
		replace: true,
		scope: {
			termStates: '='
		},
		link: function (scope) {
			scope.year = $routeParams.year;
			scope.workgroupId = $routeParams.workgroupId;
			scope.termShortCode = $routeParams.termShortCode;
			scope.currentEndHref = $location.path().split('/').pop();
			scope.isDisabled = false;

			// Term navigation is disabled in read only mode
			scope.readOnlyMode = false;

			// Instructor/SupportStaff forms should not allow for term navigation
			if (scope.currentEndHref == "instructorSupportCallForm"
			|| scope.currentEndHref == "studentSupportCallForm") {
					scope.readOnlyMode = true;
			}

			scope.termDefinitions = Term.prototype.generateTable(scope.year);

			scope.getScheduleTerms = function () {
				return scope.termDefinitions;
			};

			scope.scheduleTerms = scope.getScheduleTerms();

			scope.scheduleTerms.forEach( function(term) {
				if (term.shortCode == scope.termShortCode) {
					scope.currentTermDescription = term.description;
				}
			});

			if (scope.termShortCode == null) {
				scope.isDisabled = true;
			}

			scope.gotoTerm = function (newTermShortCode) {
				var url = $location.absUrl();

				let n = url.lastIndexOf(scope.termShortCode);
				if (n > -1) {
					url = url.substring(0, n) + newTermShortCode + url.substring(n + 2, url.length);
				}

				$window.location.href = url;
			};
		} // End Link
	};
};

export default ipaTermSelectorDropdown;