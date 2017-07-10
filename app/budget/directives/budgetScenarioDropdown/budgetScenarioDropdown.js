sharedApp.directive('budgetScenarioDropdown', function($window, $location, $routeParams, $rootScope, budgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		templateUrl: 'budgetScenarioDropdown.html', // directive html found here:
		replace: true, // Replace with the template
		link: function (scope, element, attrs) {

			scope.deleteBudgetScenario = function (budgetScenario) {
				budgetActions.deleteBudgetScenario(budgetScenario.id);
			};

			scope.selectBudgetScenario = function (budgetScenario) {
				budgetActions.selectBudgetScenario(budgetScenario.id);
			};
		} // End Link
	};
});