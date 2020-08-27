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
				// We already have an entry for this user
				if (instructor.sectionGroupCostInstructorId){
					var sectionGroupCost = {
						id: instructor.sectionGroupCostInstructorId,
						instructorId: instructor.id,
						cost: parseFloat(instructor.cost.replace(/\D/g,'')),
						reason: instructor.reason,
						sectionGroupCostId: scope.sectionGroupCost.id,
						teachingAssingnmentId: instructor.teachingAssignmentId
					};
					BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
				} else {
					console.log(instructor);
					var sectionGroupCostInstructor = {
						instructorId: instructor.id,
						cost: parseFloat(instructor.cost.replace(/\D/g,'')),
						reason: instructor.reason,
						sectionGroupCostId: scope.sectionGroupCost.id,
						teachingAssignmentId: instructor.teachingAssignmentId,
						instructorTypeId: instructor.instructorTypeId
					};
					BudgetActions.createSectionGroupCostInstructor([sectionGroupCostInstructor], true);
				}
			};
		} // end link
	};
};

export default instructorCostsLiveData;
