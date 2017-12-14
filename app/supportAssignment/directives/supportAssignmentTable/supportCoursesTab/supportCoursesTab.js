supportAssignmentApp.directive("supportCoursesTab", this.supportCoursesTab = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportCoursesTab.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
