sharedApp.directive("nav", this.nav = function($timeout, $location) {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.workgroupCode = attrs.workgroupCode;
			scope.year = attrs.year;
			scope.termCode = attrs.termCode;

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
				if (!offset) { return; }

				// Cancel any previous timers (In the case when the user clicks mutiple times)
				$timeout.cancel(scope.timer);

				// Increment/decrement the year
				scope.year = parseInt(scope.year) + offset;

				// Schedule page redirect after delay
				var delay = 1000; // milliseconds
				scope.timer = $timeout(function () {
					var url = '/' + scope.workgroupCode + '/' + scope.year + '/' + scope.termCode;
					console.log('redirecting to ' + url);
					$location.path(url);
				}, delay);
			};
		}
	}
})