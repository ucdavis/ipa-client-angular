supportAssignmentApp.directive("supportStaffTab", this.supportStaffTab = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportStaffTab.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.tabNames = ['Comments', 'Assignments'];
			scope.selectedTab = "Comments";

			scope.setViewPivot = function (tabName) {
				scope.selectedTab = tabName;
			};
		}
	};
});
