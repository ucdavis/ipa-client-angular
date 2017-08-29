/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("coursePivot", this.coursePivot = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'CoursePivot.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
});
