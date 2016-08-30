sharedApp.directive("nav", this.nav = function($location, $rootScope, authService, Term) {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.sharedState = authService.getSharedState();
			scope.termShortCode = attrs.termShortCode;

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

			// Sidebar Collapse icon
			element.find(".sidebar-collapse-icon").on('click', function (ev) {
				ev.preventDefault();
				var open = $('.page-container').hasClass("sidebar-collapsed");

				if (open) {
					$('.page-container').removeClass("sidebar-collapsed");
				}
				else {
					$('.page-container').addClass("sidebar-collapsed");
				}
			});

			scope.changeYearBy = function (offset) {
				if (!offset || !scope.sharedState.workgroup) { return; }

				// Increment/decrement the year
				scope.sharedState.year = parseInt(scope.sharedState.year) + offset;

				// Redirect the page
				var url = '/' + scope.sharedState.workgroup.id + '/' + scope.sharedState.year + '/' + scope.termShortCode;
				$location.path(url);
			};

			scope.logout = function () {
				authService.logout();
			}
		}
	}
})