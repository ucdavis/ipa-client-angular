supportAssignmentApp.directive("supportStaffTab", this.supportStaffTab = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportStaffTab.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
