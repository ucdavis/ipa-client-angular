import './budgetScenarioDropdown.css';
import { dateToCalendar } from '../../../../shared/helpers/dates';

let budgetScenarioDropdown = function($window, $location, $routeParams, $rootScope, BudgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		template: require('./budgetScenarioDropdown.html'), // directive html found here:
		replace: true, // Replace with the template
		scope: {
			state: '<'
		},
		link: function (scope) {
			scope.deleteBudgetScenario = function (budgetScenario) {
				BudgetActions.deleteBudgetScenario(budgetScenario.id);
				// Ensure bootstrap dropdown closes properly when confirming deleting budget scenario
				$(".budget-scenario-dropdown").toggleClass("open"); // eslint-disable-line no-undef
			};

			scope.selectBudgetScenario = function (budgetScenario) {
				debugger;
				BudgetActions.selectBudgetScenario(budgetScenario.id);
			};

			scope.openBudgetScenarioModal = function() {
				scope.state.openAddBudgetScenario = true;
			};

			scope.state.budgetScenarios.forEach(function(budgetScenario) {
				if (budgetScenario.fromLiveData) {
					scope.scenarioFromLiveData = budgetScenario;
				}
			});

			scope.scenarioSnapshots = scope.state.budgetScenarios.filter(budgetScenario => budgetScenario.isSnapshot);

			scope.dateToCalendar = function (date) {
        return dateToCalendar(date);
      };
		}
	};
};

export default budgetScenarioDropdown;
