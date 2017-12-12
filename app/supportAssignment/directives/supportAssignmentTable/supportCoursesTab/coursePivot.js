/**
 * Provides the main course table in the Courses View
 */
supportAssignmentApp.directive("coursePivot", this.coursePivot = function ($rootScope) {
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
