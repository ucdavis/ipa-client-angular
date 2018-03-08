workgroupApp.directive("peopleAndRoles", this.peopleAndRoles = function ($rootScope, workgroupStateService) {
	return {
		restrict: 'E',
		templateUrl: 'peopleAndRoles.html',
		replace: true,
		scope: {
			users: '<',
			activeRoleTab: '<'
		},
		link: function(scope, element, attrs) {
			scope.setRoleTab = function(tabName) {
				workgroupActionCreators.setRoleTab(tabName);
			};
		}
	};
});