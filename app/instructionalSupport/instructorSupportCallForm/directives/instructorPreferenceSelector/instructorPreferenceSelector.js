/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("instructorPreferenceSelector", this.instructorPreferenceSelector = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'InstructorPreferenceSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
});
