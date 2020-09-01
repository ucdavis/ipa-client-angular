import './instructorCostsLiveData.css';

let instructorCostsLiveData = function (BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCostsLiveData.html'),
		scope: {
			instructor: '<',
			sectionGroupCost: '<',
		},
		replace: true,
		link: function (scope) {
			scope.updateInstructorCost = function (instructor) {
				if (instructor.id){
					var sectionGroupCost = {
						id: instructor.id,
						instructorId: instructor.instructorId,
						cost: (instructor.cost || "") === "" ? null : parseFloat(instructor.cost.replace(/\D/g,'')),
						reason: instructor.reason,
						sectionGroupCostId: scope.sectionGroupCost.id,
						teachingAssignmentId: instructor.teachingAssignmentId,
						instructorTypeId: instructor.instructorTypeId
					};
					BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
				} else {
					var sectionGroupCostInstructor = {
						instructorId: instructor.instructorId,
						cost: (instructor.cost || "") === "" ? null : parseFloat(instructor.cost.replace(/\D/g,'')),
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
