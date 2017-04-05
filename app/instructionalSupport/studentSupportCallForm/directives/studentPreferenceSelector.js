/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("studentPreferenceSelector", this.studentPreferenceSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'StudentPreferenceSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
