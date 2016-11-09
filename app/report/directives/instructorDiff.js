/**
 * example:
 * <instructor-diff></instructor-diff>
 */
reportApp.directive("instructorDiff", this.instructorDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'instructorDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.assignInstructor = function (section, instructor) {
				reportActionCreators.assignInstructor(section, instructor);
			};

			scope.addBannerToDoItem = function (section, instructor) {
				reportActionCreators.addBannerToDoItem(section, "instructors", instructor);
			};
		}
	};
});
