/**
 * example:
 * <instructor-diff></instructor-diff>
 */
let instructorDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./instructorDiff.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.uniqueIndex = attrs.uniqueIndex;
			scope.assignInstructor = function () {
				RegistrarReconciliationReportActionCreators.assignInstructor(scope.section, scope.instructor);
			};

			scope.unAssignInstructor = function () {
				RegistrarReconciliationReportActionCreators.unAssignInstructor(scope.section, scope.instructor);
			};
		}
	};
};

export default instructorDiff;
