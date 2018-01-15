budgetApp.directive("instructorCosts", this.instructorCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCosts.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			instructors: '<',
			termNav: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleCourseCostsSection = function() {
				budgetActions.toggleCourseCostsSection();
			};

			scope.openCourseComments = function(course) {
				budgetActions.openAddCourseCommentsModal(course);
			};

			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};
		} // end link
	};
});
