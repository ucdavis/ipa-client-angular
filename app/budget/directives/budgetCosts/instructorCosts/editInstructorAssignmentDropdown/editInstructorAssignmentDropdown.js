let editInstructorAssignmentDropdown = function (/*BudgetActions*/) {
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
			scope.setInstructor = function(instructor) {
				console.log('Updating instructor ', instructor);
				/*var sectionGroupCost = {
						instructorId: instructor.id,
						cost: parseFloat((instructor.cost || '0.0').replace(/\D/g,'')),
						sectionGroupCostId: scope.sectionGroupCost.id
				};
				BudgetActions.createSectionGroupCostInstructor(sectionGroupCost);*/
			};
		}
	};
};

export default editInstructorAssignmentDropdown;
