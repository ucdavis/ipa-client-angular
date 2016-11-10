/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("addInstructorSupportCallSummary", this.addInstructorSupportCallSummary = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'AddInstructorSupportCallSummary.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
