import './peopleAndRoles.css';

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
		link: function(scope) {
			scope.setRoleTab = function(tabName) {
				WorkgroupActionCreators.setRoleTab(tabName);
			};
		}
	};
};

export default peopleAndRoles;
