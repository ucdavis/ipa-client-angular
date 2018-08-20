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
			regularInstructorAssignmentOptions: '<'
		},
		link: function (scope, element, attrs) {
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
