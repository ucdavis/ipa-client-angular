summaryApp.directive("scheduledCourses", this.scheduledCourses = function () {
	return {
		restrict: 'E',
		templateUrl: 'scheduledCourses.html',
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
});