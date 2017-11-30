/**
 * Provides the main course table in the Courses View
 */
supportAssignmentApp.directive("courseAssignmentSelector", this.courseAssignmentSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'CourseAssignmentSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			scope.assignStaffToSlot = function (supportAssignmentId) {
				instructionalSupportAssignmentActionCreators.assignStaffToSlot(scope.supportStaff.id ,supportAssignmentId);
			};

			scope.assignStaffToSectionGroupSlot = function (sectionGroupId, type) {
				instructionalSupportAssignmentActionCreators.assignStaffToSectionGroupSlot(scope.supportStaff.id, sectionGroupId, type);
			};
		} // end link
	};
});
