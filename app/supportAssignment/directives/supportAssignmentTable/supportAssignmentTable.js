supportAssignmentApp.directive("supportAssignmentTable", this.supportAssignmentTable = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportAssignmentTable.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.tabNames = ['By Support Staff', 'By Course'];

			scope.setViewPivot = function (tabName) {
				supportActions.setViewPivot(tabName);
			};
		}
	};
});
