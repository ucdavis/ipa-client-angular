supportAssignmentApp.directive("staffPreferences", this.staffPreferences = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'staffPreferences.html',
		replace: true,
		scope: {
			state: '<',
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});
