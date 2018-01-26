budgetApp.directive("instructorAssignmentDropdown", this.instructorAssignmentDropdown = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorAssignmentDropdown.html',
		replace: true,
		scope: {
			mode: '<',
			sectionGroupCost: '<',
			instructors: '<',
			course: '<'
		},
		link: function (scope, element, attrs) {
			scope.setInstructor = function(instructor) {
				scope.sectionGroupCost.instructorId = instructor.id;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				scope.sectionGroupCost.originalInstructorId = originalInstructor.id;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};
		} // end link
	};
});
