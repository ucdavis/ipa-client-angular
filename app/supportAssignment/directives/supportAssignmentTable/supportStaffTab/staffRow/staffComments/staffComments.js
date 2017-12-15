supportAssignmentApp.directive("staffComments", this.staffComments = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'staffComments.html',
		replace: true,
		scope: {
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});
