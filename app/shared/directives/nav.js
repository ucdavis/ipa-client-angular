sharedApp.directive("nav", this.nav = function($location, $rootScope, authService, Term) {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.sharedState = authService.getSharedState();
			console.log(scope.sharedState);
			scope.termShortCode = attrs.termShortCode;
			scope.currentBaseHref = $location.absUrl().split('/')[3];

			// TODO: Shouldn't this be set somewhere to be shared outside of <nav> ? -CT
			$rootScope.$on('sharedStateSet', function (event, data) {
				scope.sharedState = data;
				console.log(scope.sharedState);
			});
			// TODO: Move shared data being put into the nav directive. Yay clean architecture. -CT
			// A list of all possible terms, not necessarily the ones
			// with data for this schedule.
			// We leave code '04' off because it is unused.
			// This table is purposefully ordered in the order of terms in an academic year (starts with 5).
			scope.termDefinitions = Term.prototype.generateTable(scope.year);

			scope.yearOffset = function (offset) {
				var year = parseInt(scope.sharedState.year);
				if (offset) {
					// Increment/decrement the year
					year = year + offset;
				}
				return year;
			};

			scope.logout = function () {
				authService.logout();
			};

			scope.toggleSidebarState = function () {
				authService.toggleSidebarState();
			};

			scope.getYearTerms = function () {
				if (!scope.sharedState.termStates) { return; }

				var activeTerms = scope.sharedState.termStates.map(function (termState) {
					return termState.termCode;
				});
				return scope.termDefinitions.filter(function (term) {
					return activeTerms.indexOf(term.code) >= 0;
				});
			};

			scope.hasExtraWorkgroup = function () {
				if (scope.sharedState.userWorkgroups == undefined) { return false; }

				return scope.sharedState.userWorkgroups
					.some(function (w) { return w.id == scope.sharedState.workgroup.id }) == false;
			}
		}
	}
})