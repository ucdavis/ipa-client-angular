import './budgetScenarioDropdown.css';

let budgetScenarioDropdown = function($window, $location, $routeParams, $rootScope, BudgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		template: require('./budgetScenarioDropdown.html'), // directive html found here:
		replace: true, // Replace with the template
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {

			scope.deleteBudgetScenario = function (budgetScenario) {
				BudgetActions.deleteBudgetScenario(budgetScenario.id);
				// Ensure bootstrap dropdown closes properly when confirming deleting budget scenario
				$(".budget-scenario-dropdown").toggleClass("open");
			};

			scope.selectBudgetScenario = function (budgetScenario) {
				BudgetActions.selectBudgetScenario(budgetScenario.id);
			};

			scope.openBudgetScenarioModal = function() {
				scope.state.openAddBudgetScenario = true;
			};
		}
	};
};

export default budgetScenarioDropdown;
