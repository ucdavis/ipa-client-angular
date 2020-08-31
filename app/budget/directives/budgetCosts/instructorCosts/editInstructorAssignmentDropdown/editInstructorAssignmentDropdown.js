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
			console.log('Edit instructor scope ', scope);
			scope.setInstructor = function(newInstructor) {
				var sectionGroupCostInstructor = {
					id: scope.instructor.id,
					cost: parseFloat((scope.instructor.cost || '0.0').toString().replace(/\D/g,'')),
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
