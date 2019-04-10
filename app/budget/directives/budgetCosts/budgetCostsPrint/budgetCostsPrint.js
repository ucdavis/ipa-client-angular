import { toCurrency } from 'shared/helpers/string';

import './budgetCostsPrint.css';

let budgetCostsPrint = function ($rootScope, BudgetActions, TermService) {
	return {
		restrict: 'E',
		template: require('./budgetCostsPrint.html'),
		replace: true,
		scope: {
			state: '<',
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
		link: function (scope){
			var json = JSON.parse(localStorage.workgroup);
			scope.workgroupName = json.name;

			scope.allTerms = {
				'05': 'Summer Session 1',
				'06': 'Summer Special Session',
				'07': 'Summer Session 2',
				'08': 'Summer Quarter',
				'09': 'Fall Semester',
				'10': 'Fall Quarter',
				'01': 'Winter Quarter',
				'02': 'Spring Semester',
				'03': 'Spring Quarter'
			};
			
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
