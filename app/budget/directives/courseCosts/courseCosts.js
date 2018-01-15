budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
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

			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};
		} // end link
	};
});
