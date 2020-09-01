import { toCurrency } from 'shared/helpers/string';

import './budgetCosts.css';

let budgetCosts = function ($rootScope, BudgetActions, TagService) {
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
			tags: '<'
		},
		link: function (scope) {
			scope.setActiveTerm = function(activeTermTab) {
				BudgetActions.selectTerm(activeTermTab);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.getTagTextColor = function (color) {
				return TagService.getTagTextColor(color);
			};

			scope.addSectionGroupCostInstructor = function(sectionGroupCost) {
				BudgetActions.toggleSectionGroupCostInstructorModal(sectionGroupCost);
			};
		}
	};
};

export default budgetCosts;
