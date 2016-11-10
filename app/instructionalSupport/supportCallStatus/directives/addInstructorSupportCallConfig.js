/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("addInstructorSupportCallConfig", this.addInstructorSupportCallConfig = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'AddInstructorSupportCallConfig.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
