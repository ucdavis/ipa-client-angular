import { toCurrency } from 'shared/helpers/string';

import './budgetCosts.css';

let budgetCosts = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./budgetCosts.html'),
		replace: true,
		scope: {
			termNav: '<',
			scheduleCosts: '<',
			summary: '<',
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			isLiveDataScenario: '<',
		},
		link: function (scope) {
			scope.openAddCourseCommentsModal = function(sectionGroupCost) {
				BudgetActions.openAddCourseCommentsModal(sectionGroupCost);
			};

			scope.setActiveTerm = function(activeTermTab) {
				BudgetActions.selectTerm(activeTermTab);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
};

export default budgetCosts;
