summaryApp.directive("instructorHeader", this.instructorHeader = function () {
	return {
		restrict: 'E',
		templateUrl: 'instructorHeader.html',
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
});