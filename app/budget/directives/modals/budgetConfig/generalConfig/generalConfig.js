import './generalConfig.css';

let generalConfig = function (TermService, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./generalConfig.html'),
		replace: true,
		scope: {
			selectedBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {
			scope.generalConfigView = {
				allTerms: ["01", "02", "03", "05", "06", "07", "08", "09", "10"]
			};

			scope.getTermName = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.selectBudgetScenarioTerm = function(term) {
				var index = parseInt(term) - 1;
				var newValue = scope.selectedBudgetScenario.activeTermsBlob[index] == "1" ? "0" : "1";
				scope.selectedBudgetScenario.activeTermsBlob = setCharAt(scope.selectedBudgetScenario.activeTermsBlob, index, newValue);

				BudgetActions.updateBudgetScenario(scope.selectedBudgetScenario);
			};
		}
	};
};

export default generalConfig;
