budgetApp.directive("instructorCostInput", this.instructorCostInput = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCostInput.html',
		replace: true,
		scope: {
			sectionGroupCost: '<',
			course: '<'
		},
		link: function (scope, element, attrs) {
			// Determine costSource
			scope.inputValue = null;
			scope.inputSource = null;

			scope.updateSectionGroupCost = function() {
				scope.sectionGroupCost.instructorCost = scope.inputValue;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			scope.removeInstructorCost = function(sectionGroupCost) {
				scope.sectionGroupCost.instructorCost = null;
				budgetActions.updateSectionGroupCost(scope.sectionGroupCost);
			};

			// Will determine whether to use course, instructor, or lecturer as the source for 'instructorCost'
			// Also generates the appropriate tooltip message 
			scope.calculateCostSource = function() {
				var courseCost = scope.sectionGroupCost.instructorCostOverrides.sectionGroupCost;
				var instructorCost = scope.sectionGroupCost.instructorCostOverrides.instructorCost;
				var lecturerCost = scope.sectionGroupCost.instructorCostOverrides.lecturerCost;

				if (courseCost) {
					scope.inputValue = courseCost;
					scope.inputSource = "course";
				} else if (instructorCost) {
					scope.inputValue = instructorCost;
					scope.inputSource = "instructor";
				} else if (lecturerCost) {
					scope.inputValue = lecturerCost;
					scope.inputSource = "lecturer";
				}
			};

			scope.calculateCostSource();
		} // end link
	};
});
