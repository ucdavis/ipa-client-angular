import './instructorCosts.css';

let instructorCosts = function (BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCosts.html'),
		scope: {
			instructor: '<',
			originalInstructor: '<',
			sectionGroupCost: '<',
			instructorAssignmentOptions: '<',
			isFirst: '<',
			regularInstructorAssignmentOptions: '<',
		},
		replace: true,
		link: function (scope) {
			scope.updateInstructorCost = function (instructor) {
				var cost = null;
				if (instructor.cost && typeof instructor.cost === "string"){
					cost = parseFloat(instructor.cost.replace(/[^0-9.]/g,''));
				} else if (instructor.cost) {
					cost = instructor.cost;
				}
				var sectionGroupCost = {
					id: instructor.id,
					instructorId: instructor.instructorId,
					cost: cost,
					reason: instructor.reason,
					sectionGroupCostId: scope.sectionGroupCost.id,
					instructorTypeId: instructor.instructorTypeId
				};
				BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
			};

			scope.removeInstructorCost = function (instructor) {
				BudgetActions.deleteSectionGroupCostInstructor(instructor);
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
		} // end link
	};
};

export default instructorCosts;
