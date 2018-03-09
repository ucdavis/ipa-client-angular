workgroupApp.directive("peopleAndRoles", this.peopleAndRoles = function ($rootScope, workgroupActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'peopleAndRoles.html',
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
});