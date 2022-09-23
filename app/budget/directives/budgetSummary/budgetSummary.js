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
			scope.instructorIdDisplayOrder = [6, 9, 8, 5, 1, 2, 4, 10, 3, 7];
			scope.activeInstructorTypeIds = scope.summary.combinedTerms.replacementCosts.instructorTypeIds;
			scope.orderedInstructorTypeIds = scope.instructorIdDisplayOrder.filter(id => scope.activeInstructorTypeIds.includes(id));

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
