import './budgetScenarioSelector.css';

let budgetScenarioSelector = function (BudgetComparisonReportActions) {
	return {
		restrict: 'E',
		template: require('./budgetScenarioSelector.html'),
		replace: true,
		scope: {
			budgetScenarios: '<',
			selectedBudgetScenario: '<',
			isCurrent: '<'
		},
		link: function (scope) {
			scope.isOpen = false;

			scope.selectBudgetScenario = function(budgetScenario) {
				if (scope.isCurrent) {
					BudgetComparisonReportActions.selectCurrentBudgetScenario(budgetScenario.id);
				} else {
					BudgetComparisonReportActions.selectPreviousBudgetScenario(budgetScenario.id);
				}
			};
		}
	};
};

export default budgetScenarioSelector;
