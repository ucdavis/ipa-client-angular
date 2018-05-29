import './instructorCostsRow.css';

let instructorCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCostsRow.html'),
		scope: {
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			sectionGroup: '<'
		},
		replace: true,
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
