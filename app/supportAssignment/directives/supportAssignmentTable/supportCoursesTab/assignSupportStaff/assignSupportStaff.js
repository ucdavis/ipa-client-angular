supportAssignmentApp.directive("assignSupportStaff", this.assignSupportStaff = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'assignSupportStaff.html',
		replace: true,
		scope: {
			state: '<',
			assignmentOptions: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
