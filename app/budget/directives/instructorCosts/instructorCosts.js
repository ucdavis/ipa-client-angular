budgetApp.directive("instructorCosts", this.instructorCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCosts.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			instructors: '<',
			termNav: '<',
			calculatedSectionGroups: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleCourseCostsSection = function() {
				budgetActions.toggleCourseCostsSection();
			};

			scope.openCourseComments = function(sectionGroup) {
				budgetActions.openAddCourseCommentsModal(sectionGroup);
			};

			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.removeInstructor = function(sectionGroupCost) {
				sectionGroupCost.instructorId = null;
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.removeOriginalInstructor = function(sectionGroupCost) {
				sectionGroupCost.originalInstructorId = null;
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		} // end link
	};
});
