budgetApp.directive("instructorCostConfig", this.instructorCostConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCostConfig.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
