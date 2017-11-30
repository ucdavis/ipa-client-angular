/**
 * Provides the main course table in the Courses View
 */
supportAssignmentApp.directive("supportStaffSelector", this.supportStaffSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'SupportStaffSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

			scope.assignStaffToSlot = function (supportStaffId) {
				instructionalSupportAssignmentActionCreators.assignStaffToSlot(supportStaffId, scope.instructionalSupportAssignment.id);
			};
		} // end link
	};
});
