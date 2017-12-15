supportAssignmentApp.directive("staffHeader", this.staffHeader = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'staffHeader.html',
		replace: true,
		scope: {
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});
