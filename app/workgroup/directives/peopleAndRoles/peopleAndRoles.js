let peopleAndRoles = function ($rootScope, WorkgroupActionCreators) {
	return {
		restrict: 'E',
		template: require('./peopleAndRoles.html'),
		replace: true,
		scope: {
			ui: '<',
			users: '<',
			calculatedUserRoles: '<'
		},
		link: function(scope, element, attrs) {
			scope.setRoleTab = function(tabName) {
				workgroupActionCreators.setRoleTab(tabName);
			};
		}
	};
};

export default peopleAndRoles;
