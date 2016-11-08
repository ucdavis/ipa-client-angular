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
			scope.noLocal = (attrs.noLocal == "true");

			scope.assignInstructor = function (section, instructor) {
				reportActionCreators.assignInstructor(section, instructor);
			};

			scope.addBannerToDoItem = function (sectionId, seats) {
				var section = scope.view.state.sections.list[sectionId];
				reportActionCreators.addBannerToDoItem(section, UPDATE, 'seats', seats);
			};
		}
	};
});
