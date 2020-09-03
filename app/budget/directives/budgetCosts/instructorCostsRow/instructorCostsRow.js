import { toCurrency } from 'shared/helpers/string';
import { _array_compare_objects_by_key } from 'shared/helpers/array';

import './instructorCostsRow.css';

let instructorCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCostsRow.html'),
		scope: {
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			sectionGroupCost: '<',
			divider: '<',
			isLiveDataScenario: '<',
			isSnapshot: '<'
		},
		replace: true,
		link: function (scope) {
			scope._array_compare_objects_by_key = _array_compare_objects_by_key;

			scope.toggleCourseCostsSection = function() {
				BudgetActions.toggleCourseCostsSection();
			};

			scope.syncInstructor = function() {
				scope.sectionGroupCost.instructorId = scope.sectionGroupCost.sectionGroup.assignedInstructor ? scope.sectionGroupCost.sectionGroup.assignedInstructor.id : null;
				scope.sectionGroupCost.instructorTypeId = scope.sectionGroupCost.sectionGroup.assignedInstructorType ? scope.sectionGroupCost.sectionGroup.assignedInstructorType.id : null;
				BudgetActions.updateSectionGroupCost(scope.sectionGroupCost);
				if (scope.sectionGroupCost.sectionGroup){
					var currentInstructorIds = scope.sectionGroupCost.sectionGroupCostInstructors.map(function(instructor){
						return instructor.instructorId;
					});
					const instructors = scope.sectionGroupCost.sectionGroup.assignedInstructors.map(function(liveDataInstructor){
						return {
							instructorId: liveDataInstructor.id,
							instructorTypeId: liveDataInstructor.instructorTypeId,
							sectionGroupCostId: scope.sectionGroupCost.id
						};
					}).filter(instructor => !currentInstructorIds.includes(instructor.instructorId));
					BudgetActions.createSectionGroupCostInstructors(instructors);
				}
			};

			scope.removeOriginalInstructor = function(sectionGroupCost) {
				sectionGroupCost.originalInstructorTypeId = null;
				sectionGroupCost.originalInstructorId = null;
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.findOriginalInstructorBySectionGroupCost = function(sectionGroupCost) {
				if (sectionGroupCost.originalInstructorId) {
					return scope.regularInstructorAssignmentOptions.find(
						(instructor) =>
							instructor.id === sectionGroupCost.originalInstructorId
					);
				}
			};

			scope.removeInstructor = function(sectionGroupCost) {
				sectionGroupCost.instructorTypeId = null;
				sectionGroupCost.instructorId = null;
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.updateInstructorCost = function(sectionGroupCost) {
				sectionGroupCost.cost = angular.copy(parseFloat(sectionGroupCost.cost)); // eslint-disable-line no-undef
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

		} // end link
	};
};

export default instructorCostsRow;
