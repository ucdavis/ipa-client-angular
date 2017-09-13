budgetApp.directive("addBudgetScenario", this.addBudgetScenario = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addBudgetScenario.html',
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.newBudgetScenario = {};
			scope.newBudgetScenario.name = "";
			scope.newBudgetScenario.budgetScenarioId = 0;
			scope.newBudgetScenario.description = "Schedule Data";

			scope.budgetId = attrs.budgetId;

			scope.selectBudgetScenario = function(budgetScenario) {
				if (budgetScenario == null) {
					scope.newBudgetScenario.budgetScenarioId = 0;
					scope.newBudgetScenario.description = "Schedule Data";
				} else {
					scope.newBudgetScenario.budgetScenarioId = budgetScenario.id;
					scope.newBudgetScenario.description = budgetScenario.name;
				}
			};
			scope.submitBudgetScenarioForm = function () {
				budgetActions.createBudgetScenario(scope.newBudgetScenario, scope.state.budget.id, scope.newBudgetScenario.budgetScenarioId);
			};

			scope.close = function() {
				scope.isVisible = false;
			};
		} // end link
	};
});
