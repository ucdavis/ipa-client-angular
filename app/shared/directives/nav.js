sharedApp.directive("nav", this.nav = function ($location, $rootScope, authService, Term) {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.sharedState = authService.getSharedState();
			scope.termShortCode = attrs.termShortCode;
			scope.currentBaseHref = $location.absUrl().split('/')[3];
			var lastUrlSegmentIndex = $location.absUrl().split('/').length - 1;
			scope.currentEndHref = $location.absUrl().split('/')[lastUrlSegmentIndex];
			scope.pageMode = $location.absUrl().split('mode=')[1];

			// TODO: Shouldn't this be set somewhere to be shared outside of <nav> ? -CT
			$rootScope.$on('sharedStateSet', function (event, data) {
				scope.sharedState = data;
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

			scope.getFirstYearTerm = function () {
				var yearTerms = scope.getYearTerms();

				// Does a yearTerm exist?
				if (yearTerms && yearTerms.length > 0) {
					return yearTerms[0];
				}
				return null;
			}

			/**
			 * Return true only if the user is viewing a workgroup they are not part of
			 * (happens if the current user is admin and managing a workgroup they're not in)
			 */
			scope.hasExtraWorkgroup = function () {
				if (scope.sharedState.userWorkgroups === undefined) { return false; }

				return scope.sharedState.userWorkgroups
					.some(function (w) { return w.id == scope.sharedState.workgroup.id; }) === false;
			};

			/**
			 * Checks if user has any of the given roles for the current active workgroup
			 */
			scope.userHasRoles = function (roles) {
				if (scope.sharedState.isAdmin) { return true; }

				if (roles instanceof Array === false) { return false; }
				return roles.some(function (r) {
					return scope.sharedState.currentUserRoles.indexOf(r) >= 0;
				});
			};

			scope.userHasRolesForWorkgroup = function (roles, workgroup) {
				if (scope.sharedState.isAdmin) { return true; }

				if (roles instanceof Array === false) { return false; }
				return scope.sharedState.allUserRoles.some(function (ur) {
					return ur.workgroupId == workgroup.id && roles.indexOf(ur.roleName) >= 0;
				});
			};

			// Example: "/assignments/15/2017?tab=courses" -> "/assignments/15/2018?tab=courses"
			// Takes the current page url, offsets the year by the specified amount, and returns a new url
			scope.offsetYearInUrl = function (offset) {
				var workgroupId = scope.sharedState.workgroup.id;
				var originalYear = scope.sharedState.year;
				var newYear = originalYear + offset;

				var domainAndPort = $location.absUrl().split('/')[2];
				var fullPath = $location.absUrl().split(domainAndPort)[1];
				var pathAfterYear = fullPath.split(originalYear)[1] || '';

				$location.url(workgroupId + '/' + newYear + pathAfterYear);
			};
		}
	};
});