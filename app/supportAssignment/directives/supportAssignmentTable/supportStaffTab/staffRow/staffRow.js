supportAssignmentApp.directive("staffRow", this.staffRow = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'staffRow.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});
