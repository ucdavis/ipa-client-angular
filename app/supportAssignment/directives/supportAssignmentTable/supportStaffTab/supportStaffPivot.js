/**
 * Provides the main course table in the Courses View
 */
supportAssignmentApp.directive("supportStaffPivot", this.supportStaffPivot = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'SupportStaffPivot.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
});
