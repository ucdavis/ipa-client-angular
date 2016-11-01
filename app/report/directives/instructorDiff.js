/**
 * example:
 * <instructor-diff></instructor-diff>
 */
reportApp.directive("instructorDiff", this.instructorDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'instructorDiff.html',
		link: function (scope, element, attrs) {
			scope.noLocal = (attrs.noLocal == "true");
		}
	};
});
