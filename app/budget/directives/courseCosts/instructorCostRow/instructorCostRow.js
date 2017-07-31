budgetApp.directive("instructorCostRow", this.instructorCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCostRow.html',
		replace: true,
		scope: {
			sectionGroupCost: '<',
			instructors: '<'
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

			scope.displayProperty = function(sectionGroupCost, propertyName) {
				budgetActions.toggleSectionGroupCostDetail(sectionGroupCost.id, propertyName);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost, propertyName) {
				budgetActions.toggleSectionGroupCostDetail(sectionGroupCost.id, propertyName);
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.setInstructor = function(instructor) {
				budgetActions.toggleSectionGroupCostDetail(scope.sectionGroupCost.id, 'instructor');
				scope.sectionGroupCost.instructorId = instructor.id;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.removeInstructor = function(instructor) {
				budgetActions.toggleSectionGroupCostDetail(scope.sectionGroupCost.id, 'instructor');
				scope.sectionGroupCost.instructorId = null;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.setOriginalInstructor = function(originalInstructor) {
				budgetActions.toggleSectionGroupCostDetail(scope.sectionGroupCost.id, 'originalInstructor');
				scope.sectionGroupCost.originalInstructorId = originalInstructor.id;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.removeOriginalInstructor = function(originalInstructor) {
				budgetActions.toggleSectionGroupCostDetail(scope.sectionGroupCost.id, 'originalInstructor');
				scope.sectionGroupCost.originalInstructorId = null;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};
		} // end link
	};
});
