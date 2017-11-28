instructionalSupportApp.directive("studentPreferenceSelector", this.studentPreferenceSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'studentPreferenceSelector.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
});
