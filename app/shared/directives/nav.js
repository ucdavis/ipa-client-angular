sharedApp.directive("nav", this.nav = function($timeout, $location, $rootScope, authService) {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.sharedState = authService.getSharedState();
			scope.termCode = attrs.termCode;

			// TODO: Shouldn't this be set somewhere to be shared outside of <nav> ? -CT
			$rootScope.$on('sharedStateSet', function (event, data) {
				scope.sharedState = data;
			});

			scope.terms = [
				{ id: 1, description: "Fall Quarter", code: "10" },
				{ id: 2, description: "Winter Quarter", code: "01" },
				{ id: 3, description: "Spring Quarter", code: "03" }
			];

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

				// Cancel any previous timers (In the case when the user clicks mutiple times)
				$timeout.cancel(scope.timer);

				// Increment/decrement the year
				scope.sharedState.year = parseInt(scope.sharedState.year) + offset;

				// Schedule page redirect after delay
				var delay = 1000; // milliseconds
				scope.timer = $timeout(function () {
					var url = '/' + scope.sharedState.workgroup.code + '/' + scope.sharedState.year + '/' + scope.termCode;
					console.log('redirecting to ' + url);
					$location.path(url);
				}, delay);
			};

			scope.logout = function () {
				authService.logout();
			}
		}
	}
})