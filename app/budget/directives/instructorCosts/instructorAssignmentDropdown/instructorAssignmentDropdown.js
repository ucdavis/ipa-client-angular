budgetApp.directive("instructorAssignmentDropdown", this.instructorAssignmentDropdown = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorAssignmentDropdown.html',
		replace: true,
		scope: {
			mode: '<',
			sectionGroup: '<',
			instructors: '<'
		},
		link: function (scope, element, attrs) {
			scope.setInstructor = function(instructor) {
				budgetActions.setInstructorFromSectionGroup(scope.sectionGroup, instructor.id);
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				budgetActions.setOriginalInstructorFromSectionGroup(scope.sectionGroup, originalInstructor.id);
			};
		} // end link
	};
});
