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
				console.log('Updating instructor ', scope.instructor);
					var sectionGroupCost = {
						id: scope.instructor.id,
						instructorId: newInstructor.id,
						cost: parseFloat((scope.instructor.cost || '0.0').toString().replace(/\D/g,'')),
						reason: scope.instructor.reason,
						sectionGroupCostId: scope.instructor.sectionGroupCostId,
						teachingAssingnmentId: scope.instructor.teachingAssignmentId
					};
					BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
			};
		}
	};
};

export default editInstructorAssignmentDropdown;
