supportAssignmentApp.directive("supportStaffTab", this.supportStaffTab = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportStaffTab.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.radioNames = ["Teaching Assistants", "Readers"];

			scope.setViewType = function(type) {
				supportActions.setViewType(type);
			};
		}
	};
});
