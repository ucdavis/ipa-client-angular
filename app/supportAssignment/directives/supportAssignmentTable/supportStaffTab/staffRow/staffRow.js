supportAssignmentApp.directive("staffRow", this.staffRow = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'staffRow.html',
		replace: true,
		scope: {
			state: '<',
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			scope.tabNames = ['Assignments', 'Comments'];

			scope.setSupportStaffTab = function (tabName) {
				supportActions.setSupportStaffTab(tabName, scope.supportStaff.id);
			};
		}
	};
});
