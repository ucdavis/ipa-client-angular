workgroupApp.directive("studentRoleSelector", this.studentRoleSelector = function (workgroupActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'studentRoleSelector.html',
		replace: true,
		scope: {
			studentRoles: '<',
			userRole: '<'
		},
		link: function(scope, element, attrs) {
			scope.updateStudentRole = function(role) {
				scope.userRole.roleId = role.id;
				workgroupActionCreators.updateStudentRole(scope.userRole);
			};
		}
	};
});
