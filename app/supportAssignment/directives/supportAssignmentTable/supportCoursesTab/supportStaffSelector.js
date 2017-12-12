/**
 * Provides the main course table in the Courses View
 */
supportAssignmentApp.directive("supportStaffSelector", this.supportStaffSelector = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'SupportStaffSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

			scope.assignStaffToSlot = function (supportStaffId) {
				supportActions.assignStaffToSlot(supportStaffId, scope.instructionalSupportAssignment.id);
			};
		} // end link
	};
});
