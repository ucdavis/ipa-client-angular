supportAssignmentApp.directive("supportAssignmentToolbar", this.supportAssignmentToolbar = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportAssignmentToolbar.html',
		replace: true,
		scope: {},
		link: function (scope, element, attrs) {
			// intentionally empty
		}
	};
});
