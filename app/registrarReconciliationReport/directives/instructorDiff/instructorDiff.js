/**
 * example:
 * <instructor-diff></instructor-diff>
 */
registrarReconciliationReportApp.directive("instructorDiff", this.instructorDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'instructorDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.uniqueIndex = attrs.uniqueIndex;
			scope.assignInstructor = function () {
				reportActionCreators.assignInstructor(scope.section, scope.instructor);
			};

			scope.unAssignInstructor = function () {
				reportActionCreators.unAssignInstructor(scope.section, scope.instructor);
			};
		}
	};
});
