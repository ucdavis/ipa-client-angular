/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("addStudentSupportCallConfig", this.addStudentSupportCallConfig = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'AddStudentSupportCallConfig.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {


		} // end link
	};
});
