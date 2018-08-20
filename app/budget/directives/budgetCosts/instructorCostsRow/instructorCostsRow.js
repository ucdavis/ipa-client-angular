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

			scope.syncInstructor = function() {
				scope.sectionGroupCost.instructorId = scope.sectionGroupCost.sectionGroup.assignedInstructor ? scope.sectionGroupCost.sectionGroup.assignedInstructor.id : null;
				scope.sectionGroupCost.instructorTypeId = scope.sectionGroupCost.sectionGroup.assignedInstructorType ? scope.sectionGroupCost.sectionGroup.assignedInstructorType.id : null;
				BudgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.removeOriginalInstructor = function(sectionGroupCost) {
				sectionGroupCost.originalInstructorTypeId = null;
				sectionGroupCost.originalInstructorId = null;
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.updateInstructorCost = function(sectionGroupCost) {
				sectionGroupCost.cost = angular.copy(parseFloat(sectionGroupCost.cost));
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

		} // end link
	};
};

export default instructorCostsRow;
