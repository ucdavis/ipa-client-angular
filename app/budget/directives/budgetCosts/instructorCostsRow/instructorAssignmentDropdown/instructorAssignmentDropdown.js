let instructorAssignmentDropdown = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./instructorAssignmentDropdown.html'),
		replace: true,
		scope: {
			mode: '<',
			sectionGroupCost: '<',
			instructors: '<'
		},
		link: function (scope, element, attrs) {
			scope.setInstructor = function(instructor) {
				if (instructor.isInstructorType) {
					BudgetActions.setInstructorTypeFromSectionGroup(scope.sectionGroupCost, instructor);
				} else {
					BudgetActions.setInstructorFromSectionGroup(scope.sectionGroupCost, instructor);
				}
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				BudgetActions.setOriginalInstructorFromSectionGroup(scope.sectionGroupCost, originalInstructor.id);
			};
		} // end link
	};
};

export default instructorAssignmentDropdown;
