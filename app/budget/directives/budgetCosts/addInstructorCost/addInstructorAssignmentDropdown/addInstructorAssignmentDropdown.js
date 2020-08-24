let addInstructorAssignmentDropdown = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./addInstructorAssignmentDropdown.html'),
		replace: true,
		scope: {
			mode: '<',
			sectionGroupCost: '<',
			instructors: '<'
		},
		link: function (scope) {
			scope.setInstructor = function(instructor) {
				console.log('Setting instructor ', instructor);
				var sectionGroupCost = {
						instructorId: instructor.id,
						cost: parseFloat((instructor.cost || '0.0').replace(/\D/g,'')),
						sectionGroupCostId: scope.sectionGroupCost.id
				};
				BudgetActions.createSectionGroupCostInstructor(sectionGroupCost);
			};
		}
	};
};

export default addInstructorAssignmentDropdown;
