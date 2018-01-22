budgetApp.directive("groupCostConfig", this.groupCostConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'groupCostConfig.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
