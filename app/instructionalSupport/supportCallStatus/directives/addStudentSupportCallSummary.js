/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("addStudentSupportCallSummary", this.addStudentSupportCallSummary = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'AddStudentSupportCallSummary.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {


		} // end link
	};
});
