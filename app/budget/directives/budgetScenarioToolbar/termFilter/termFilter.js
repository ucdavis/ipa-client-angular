import './termFilter.css';

let termFilter = function ($rootScope, TermService, BudgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		template: require('./termFilter.html'),
		replace: true, // Replace with the template below
		scope: {
			activeTerms: '<',
			selectedBudgetScenario: '<'
		},
		link: function(scope, element, attrs) {
			scope.isVisible = false;

			scope.getTermName = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.allTerms = ["01", "02", "03", "05", "06", "07", "08", "09", "10"];

			scope.toggleDropdown = function () {
				scope.isVisible = !scope.isVisible;
			};

			scope.close = function () {
				scope.isVisible = false;
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

export default termFilter;
