import { toCurrency } from 'shared/helpers/string';

import './budgetCostsPrint.css';

let budgetCostsPrint = function ($rootScope, BudgetActions, TermService) {
	return {
		restrict: 'E',
		template: require('./budgetCostsPrint.html'),
		replace: true,
		scope: {
			summary: '<',
			instructorTypes: '<',
			selectedBudgetScenario: '<',
			termNav: '<',
			scheduleCosts: '<',
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			isLiveDataScenario: '<',
			lineItems: '<'
		},
		link: function (scope) {
			scope.openAddCourseCommentsModal = function(sectionGroupCost) {
				BudgetActions.openAddCourseCommentsModal(sectionGroupCost);
			};

			scope.setActiveTerm = function(activeTermTab) {
				BudgetActions.selectTerm(activeTermTab);
			};

			scope.getTermName = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
};

export default budgetCostsPrint;
