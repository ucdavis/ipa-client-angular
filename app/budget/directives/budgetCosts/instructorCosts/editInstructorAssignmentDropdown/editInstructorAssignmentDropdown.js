let editInstructorAssignmentDropdown = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./editInstructorAssignmentDropdown.html'),
		replace: true,
		scope: {
			mode: '<',
			sectionGroupCost: '<',
			instructors: '<',
			instructor: '<'
		},
		link: function (scope) {
			scope.setInstructor = function(newInstructor) {
				var cost = null;
				if (scope.instructor.cost && typeof scope.instructor.cost === "string"){
					cost = parseFloat(scope.instructor.cost.replace(/[^0-9.]/g,''));
				} else if (scope.instructor.cost) {
					cost = scope.instructor.cost;
				}
				var sectionGroupCostInstructor = {
					id: scope.instructor.id,
					cost: cost,
					reason: scope.instructor.reason,
					sectionGroupCostId: scope.instructor.sectionGroupCostId,
				};
				if (newInstructor.isInstructorType){
					sectionGroupCostInstructor.instructorTypeId = newInstructor.id;
					sectionGroupCostInstructor.instructorId = null;
				} else {
					sectionGroupCostInstructor.instructorId = newInstructor.id,
					sectionGroupCostInstructor.instructorTypeId = newInstructor.instructorType.id;
				}
				BudgetActions.updateSectionGroupCostInstructor(sectionGroupCostInstructor);
			};
		}
	};
};

export default editInstructorAssignmentDropdown;
