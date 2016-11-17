/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("courseAssignmentSelector", this.courseAssignmentSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'CourseAssignmentSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
