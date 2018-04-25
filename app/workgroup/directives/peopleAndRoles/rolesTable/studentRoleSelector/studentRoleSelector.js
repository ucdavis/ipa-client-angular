let studentRoleSelector = function (WorkgroupActionCreators) {
	return {
		restrict: 'E',
		template: require('./studentRoleSelector.html'),
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
};

export default studentRoleSelector;
