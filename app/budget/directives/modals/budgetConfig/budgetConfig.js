budgetApp.directive("budgetConfig", this.budgetConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'budgetConfig.html',
		replace: true,
		scope: {
			state: '<',
			selectedBudgetScenario: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.close = function() {
				scope.isVisible = false;
			};
		}
	};
});
