/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("supportStaffSelector", this.supportStaffSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'SupportStaffSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
