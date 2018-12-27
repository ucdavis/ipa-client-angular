import { toCurrency } from 'shared/helpers/string';

import './budgetSummary.css';

let budgetSummary = function ($rootScope, TermService) {
	return {
		restrict: 'E',
		template: require('./budgetSummary.html'),
		replace: true,
		scope: {
			summary: '<',
			instructorTypes: '<',
			selectedBudgetScenario: '<'
		},
		link: function (scope) {
			scope.getTermName = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
};

export default budgetSummary;
