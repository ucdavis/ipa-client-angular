workgroupApp.directive("rolesTable", this.rolesTable = function ($rootScope, workgroupStateService) {
	return {
		restrict: 'E',
		templateUrl: 'rolesTable.html',
		replace: true,
		scope: {
			users: '<',
			activeRoleTab: '<'
		},
		link: function(scope, element, attrs) {
			// intentionally blank
		}
	};
});