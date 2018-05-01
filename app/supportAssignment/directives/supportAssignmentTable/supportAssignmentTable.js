import './supportAssignmentTable.css';

let supportAssignmentTable = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./supportAssignmentTable.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.tabNames = ['By Support Staff', 'By Course'];

			scope.setViewPivot = function (tabName) {
				SupportActions.setViewPivot(tabName);
			};
		}
	};
};

export default supportAssignmentTable;
