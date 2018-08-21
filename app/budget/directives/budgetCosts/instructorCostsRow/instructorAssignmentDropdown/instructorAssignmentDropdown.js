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
					scope.sectionGroupCost.instructorId = null;
					scope.sectionGroupCost.instructorTypeId = instructor.id;
					BudgetActions.updateSectionGroupCost(scope.sectionGroupCost);
				} else {
					scope.sectionGroupCost.instructorId = instructor.id;
					scope.sectionGroupCost.instructorTypeId = instructor.instructorType.id;
					BudgetActions.updateSectionGroupCost(scope.sectionGroupCost);
				}
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				scope.sectionGroupCost.originalInstructorId = originalInstructor.id;
				BudgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};
		}
	};
};

export default instructorAssignmentDropdown;
