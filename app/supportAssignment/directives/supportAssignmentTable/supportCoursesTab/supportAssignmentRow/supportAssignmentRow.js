supportAssignmentApp.directive("supportAssignmentRow", this.supportAssignmentRow = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportAssignmentRow.html',
		replace: true,
		scope: {
			name: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});
