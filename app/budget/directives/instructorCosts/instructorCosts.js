budgetApp.directive("instructorCosts", this.instructorCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCosts.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			instructors: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleCourseCostsSection = function() {
				budgetActions.toggleCourseCostsSection();
			};

			scope.openCourseComments = function(course) {
				budgetActions.openAddCourseCommentsModal(course);
			};
		} // end link
	};
});
