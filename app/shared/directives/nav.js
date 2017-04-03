sharedApp.directive("nav", this.nav = function ($location, $rootScope, authService, Term) {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.sharedState = authService.getSharedState();
			scope.termShortCode = attrs.termShortCode;
			scope.currentBaseHref = $location.absUrl().split('/')[3];
			scope.currentEndHref = $location.path().split('/').pop();
			scope.pageMode = $location.search().mode;
			scope.userWorkgroups = scope.sharedState.currentUser ? scope.sharedState.currentUser.getWorkgroups() : [];

			scope.isInstructor = scope.sharedState.currentUser.isInstructor(scope.sharedState.workgroup.id);
			scope.isSupportStaff = scope.sharedState.currentUser.isSupportStaff(scope.sharedState.workgroup.id);
			scope.isAdmin = scope.sharedState.currentUser.isAdmin();
			scope.isPlanner = scope.sharedState.currentUser.isPlanner(scope.sharedState.workgroup.id);

			// If a user fills multiple types of roles, the nav should open those summary screens
			scope.showMultipleSummary = function() {
				var numberOfRoles = 0;
				if (scope.isInstructor) { numberOfRoles++;}
				if (scope.isSupportStaff) { numberOfRoles++;}
				if (scope.isPlanner) { numberOfRoles++;}
				if (scope.isAdmin) { numberOfRoles = 3;}

				return (numberOfRoles > 1);
			};

			// TODO: Shouldn't this be set somewhere to be shared outside of <nav> ? -CT
			$rootScope.$on('sharedStateSet', function (event, data) {
				scope.sharedState = data;
				scope.userWorkgroups = scope.sharedState.currentUser ? scope.sharedState.currentUser.getWorkgroups() : [];
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

			/**
			 * Return true only if the user is viewing a workgroup they are not part of
			 * (happens if the current user is admin and managing a workgroup they're not in)
			 */
			scope.hasExtraWorkgroup = function () {
				if (scope.sharedState.currentUser === undefined) { return false; }

				var userWorkgroups = scope.sharedState.currentUser.getWorkgroups();
				if (userWorkgroups === undefined) { return false; }

				return userWorkgroups
					.some(function (w) { return w.id == scope.sharedState.workgroup.id; }) === false;
			};

			/**
			 * Checks if user has any of the given roles for the current active workgroup
			 */
			scope.userHasRoles = function (roleNames) {
				if (scope.sharedState.currentUser === undefined) { return false; }
				if (scope.sharedState.currentUser.isAdmin()) { return true; }
				return scope.sharedState.currentUser.hasRoles(roleNames, scope.sharedState.workgroup.id);
			};

			scope.userHasRolesForWorkgroup = function (roleNames, workgroup) {
				if (scope.sharedState.currentUser === undefined) { return false; }
				if (scope.sharedState.currentUser.isAdmin()) { return true; }
				return scope.sharedState.currentUser.hasRoles(roleNames, workgroup.id);
			};

			// Example: "/assignments/15/2017?tab=courses" -> "/assignments/15/2018?tab=courses"
			// Takes the current page url, offsets the year by the specified amount, and returns a new url
			scope.offsetYearInUrl = function (offset) {
				var workgroupId = scope.sharedState.workgroup.id;
				var newYear = scope.sharedState.year + offset;
				var pathAfterYear = $location.url().split(scope.sharedState.year)[1] || '';

				$location.url(workgroupId + '/' + newYear + pathAfterYear);
			};

			scope.toggleMenuItem = function (item) {
				scope.expanded = (scope.expanded == item) ? null : item;
			};
		} // End link
	};
});