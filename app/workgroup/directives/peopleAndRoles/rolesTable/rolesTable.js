workgroupApp.directive("rolesTable", this.rolesTable = function ($rootScope, workgroupActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'rolesTable.html',
		replace: true,
		scope: {
			userRoles: '<',
			activeRoleId: '<'
		},
		link: function(scope, element, attrs) {
			// Intentionally blank
		}
	};
});