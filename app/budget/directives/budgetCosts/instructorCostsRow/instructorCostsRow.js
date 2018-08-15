import './instructorCostsRow.css';

let instructorCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCostsRow.html'),
		scope: {
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			sectionGroupCost: '<',
			divider: '<'
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

			scope.updateInstructorCost = function(sectionGroup, overrideInstructorCost) {
				sectionGroup.cost = angular.copy(parseFloat(sectionGroup.overrideInstructorCost));

				scope.overrideSectionGroup(sectionGroup, 'instructorCost');
			};

			scope.overrideSectionGroup = function(sectionGroup, property) {
				BudgetActions.overrideSectionGroup(sectionGroup, property);
			};
		} // end link
	};
};

export default instructorCostsRow;
