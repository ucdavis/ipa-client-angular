workgroupApp.directive("roleTab", this.roleTab = function (workgroupStateService) {
	return {
		restrict: 'E',
		templateUrl: 'roleTab.html',
		replace: true,
		scope: {
			users: '<',
			activeRoleTab: '<'
		},
		link: function(scope, element, attrs) {
			// Intentionally blank
		}
	};
});