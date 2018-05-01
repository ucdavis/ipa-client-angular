import './staffRow.css';

let staffRow = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./staffRow.html'),
		replace: true,
		scope: {
			state: '<',
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			scope.tabNames = ['Assignments', 'Comments'];

			scope.setSupportStaffTab = function (tabName) {
				SupportActions.setSupportStaffTab(tabName, scope.supportStaff.id);
			};
		}
	};
};

export default staffRow;
