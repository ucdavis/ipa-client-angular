import './instructorCostsLiveData.css';

let instructorCostsLiveData = function (BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCostsLiveData.html'),
		scope: {
			instructor: '<',
			sectionGroupCost: '<',
			divider: '<',
			isSnapshot: '<',
			isFirst: '<',
			regularInstructorAssignmentOptions: '<',
		},
		replace: true,
		link: function (scope) {
			console.log('Live Data ', scope);
			scope.updateInstructorCost = function (instructor) {
				// IPA Input tracks cost as string
				// Backend sends cost as float
				var cost = null;
				if (instructor.cost && typeof instructor.cost === "string"){
					cost = parseFloat(instructor.cost.replace(/\D/g,''));
				} else if (instructor.cost) {
					cost = instructor.cost;
				}
				if (instructor.id){
					var sectionGroupCost = {
						id: instructor.id,
						instructorId: instructor.instructorId,
						cost: cost,
						reason: instructor.reason,
						sectionGroupCostId: scope.sectionGroupCost.id,
						teachingAssignmentId: instructor.teachingAssignmentId,
						instructorTypeId: instructor.instructorTypeId
					};
					BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
				} else {
					var sectionGroupCostInstructor = {
						instructorId: instructor.instructorId,
						cost: cost,
						reason: instructor.reason,
						sectionGroupCostId: scope.sectionGroupCost.id,
						teachingAssignmentId: instructor.teachingAssignmentId,
						instructorTypeId: instructor.instructorTypeId
					};
					BudgetActions.createSectionGroupCostInstructors([sectionGroupCostInstructor], true);
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
		} // end link
	};
};

export default instructorCostsLiveData;
