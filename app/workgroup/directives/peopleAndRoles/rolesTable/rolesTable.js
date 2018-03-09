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
			scope.removeUserRole = function (userRole) {
				workgroupActionCreators.removeRoleFromUser(userRole.userId, userRole.roleId, userRole);
			};
		}
	};
});