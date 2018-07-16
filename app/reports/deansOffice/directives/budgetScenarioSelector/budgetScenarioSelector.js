import './budgetScenarioSelector.css';

let budgetScenarioSelector = function (DeansOfficeReportActions) {
	return {
		restrict: 'E',
		template: require('./budgetScenarioSelector.html'),
		replace: true,
		scope: {
			budgetScenarios: '<',
			selectedBudgetScenario: '<',
			isCurrent: '<'
		},
		link: function (scope, element, attrs) {
			scope.isOpen = false;

			scope.selectBudgetScenario = function(budgetScenario) {
				if (scope.isCurrent) {
					DeansOfficeReportActions.selectCurrentBudgetScenario(budgetScenario.id);
				} else {
					DeansOfficeReportActions.selectPreviousBudgetScenario(budgetScenario.id);
				}
			};
		}
	};
};

export default budgetScenarioSelector;
