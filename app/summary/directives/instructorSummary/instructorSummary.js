summaryApp.directive("instructorSummary", this.instructorSummary = function () {
	return {
		restrict: 'E',
		templateUrl: 'instructorSummary.html',
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
});
