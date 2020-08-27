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
						cost: null,
						sectionGroupCostId: scope.sectionGroupCost.id,
						instructorTypeId: instructor.instructorType.id
				};
				BudgetActions.createSectionGroupCostInstructor([sectionGroupCost]);
			};
		}
	};
};

export default addInstructorAssignmentDropdown;
