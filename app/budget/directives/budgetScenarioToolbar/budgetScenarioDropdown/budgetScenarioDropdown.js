sharedApp.directive('budgetScenarioDropdown', function($window, $location, $routeParams, $rootScope, budgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		templateUrl: 'budgetScenarioDropdown.html', // directive html found here:
		replace: true, // Replace with the template
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {

			scope.deleteBudgetScenario = function (budgetScenario) {
				budgetActions.deleteBudgetScenario(budgetScenario.id);
				// Ensure bootstrap dropdown closes properly when confirming deleting budget scenario
				$(".budget-scenario-dropdown").toggleClass("open");
			};

			scope.selectBudgetScenario = function (budgetScenario) {
				budgetActions.selectBudgetScenario(budgetScenario.id);
			};

			scope.openBudgetScenarioModal = function() {
				scope.state.openAddBudgetScenario = true;
			};
		}
	};
});