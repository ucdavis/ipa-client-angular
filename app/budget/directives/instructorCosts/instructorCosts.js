budgetApp.directive("instructorCosts", this.instructorCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCosts.html',
		replace: true,
		scope: {
			instructorAssignmentOptions: '<',
			regularInstructorAssignmentOptions: '<',
			termNav: '<',
			calculatedSectionGroups: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleCourseCostsSection = function() {
				budgetActions.toggleCourseCostsSection();
			};

			scope.openAddCourseCommentsModal = function(sectionGroup) {
				budgetActions.openAddCourseCommentsModal(sectionGroup);
			};

			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};

			scope.removeInstructor = function(sectionGroupCost) {
				sectionGroupCost.instructorId = null;
				sectionGroupCost.instructorTypeId = null;
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.removeOriginalInstructor = function(sectionGroupCost) {
				sectionGroupCost.originalInstructorId = null;
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.updateInstructorCost = function(sectionGroupCost, overrideInstructorCost) {
				sectionGroupCost.cost = angular.copy(parseFloat(overrideInstructorCost));

				scope.updateSectionGroupCost(sectionGroupCost);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};
		} // end link
	};
});
