let instructorAssignmentDropdown = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./instructorAssignmentDropdown.html'),
		replace: true,
		scope: {
			mode: '<',
			sectionGroup: '<',
			instructors: '<'
		},
		link: function (scope, element, attrs) {
			scope.setInstructor = function(instructor) {
				if (instructor.isInstructorType) {
					BudgetActions.setInstructorTypeFromSectionGroup(scope.sectionGroup, instructor);
				} else {
					BudgetActions.setInstructorFromSectionGroup(scope.sectionGroup, instructor);
				}
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				BudgetActions.setOriginalInstructorFromSectionGroup(scope.sectionGroup, originalInstructor.id);
			};
		} // end link
	};
};

export default instructorAssignmentDropdown;
