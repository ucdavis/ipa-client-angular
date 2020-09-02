import './instructorCostsLiveData.css';

let instructorCostsLiveData = function (BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCostsLiveData.html'),
		scope: {
			instructor: '<',
			sectionGroupCost: '<',
			divider: '<',
		},
		replace: true,
		link: function (scope) {
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
		} // end link
	};
};

export default instructorCostsLiveData;
