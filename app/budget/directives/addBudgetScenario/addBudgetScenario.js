/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("addBudgetScenario", this.addBudgetScenario = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addBudgetScenario.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			scope.newBudgetScenario = {};
			scope.newBudgetScenario.name = "";
			scope.newBudgetScenario.budgetScenarioId = 0;
			scope.budgetId = attrs.budgetId;

			scope.submitBudgetScenarioForm = function () {
				budgetActions.createBudgetScenario(scope.newBudgetScenario, scope.budgetId);
			};
			scope.cancel = function () {
				
			}
		} // end link
	};
});
