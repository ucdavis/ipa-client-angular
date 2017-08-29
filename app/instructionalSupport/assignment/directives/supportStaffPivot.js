/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("supportStaffPivot", this.supportStaffPivot = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'SupportStaffPivot.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
});
