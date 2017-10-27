budgetApp.directive("instructorCostRow", this.instructorCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCostRow.html',
		replace: true,
		scope: {
			sectionGroupCost: '<',
			instructors: '<',
			course: '<'
		},
		link: function (scope, element, attrs) {
			if (scope.sectionGroupCost && scope.sectionGroupCost.instructor) {
				scope.instructorButtonText = scope.sectionGroupCost.instructor.fullName;
			} else {
				scope.instructorButtonText = "Assign instructor";
			}

			if (scope.sectionGroupCost && scope.sectionGroupCost.originalInstructor) {
				scope.originalInstructorButtonText = scope.sectionGroupCost.originalInstructor.fullName;
			} else {
				scope.originalInstructorButtonText = "Assign instructor";
			}

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.setInstructor = function(instructor) {
				scope.sectionGroupCost.instructorId = instructor.id;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.removeInstructor = function(instructor) {
				scope.sectionGroupCost.instructorId = null;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				scope.sectionGroupCost.originalInstructorId = originalInstructor.id;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.removeOriginalInstructor = function(originalInstructor) {
				scope.sectionGroupCost.originalInstructorId = null;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.openCourseComments = function(course) {
				budgetActions.openAddCourseCommentsModal(course);
			};
		} // end link
	};
});
