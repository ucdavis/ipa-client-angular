import './instructorCostsRow.css';

let instructorCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./instructorCostsRow.html'),
		replace: true,
		scope: {
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			termNav: '<',
			calculatedSectionGroups: '<',
			summary: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleCourseCostsSection = function() {
				BudgetActions.toggleCourseCostsSection();
			};

			scope.removeInstructor = function(sectionGroupCost) {
				sectionGroupCost.instructorId = null;
				sectionGroupCost.instructorTypeId = null;
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.removeOriginalInstructor = function(sectionGroupCost) {
				sectionGroupCost.originalInstructorId = null;
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.updateInstructorCost = function(sectionGroupCost, overrideInstructorCost) {
				sectionGroupCost.cost = angular.copy(parseFloat(overrideInstructorCost));

				scope.updateSectionGroupCost(sectionGroupCost);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};
		} // end link
	};
};

export default instructorCostsRow;
