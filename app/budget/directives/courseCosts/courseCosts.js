budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
		replace: true,
		scope: {
			activeBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleCourseCostsSection = function() {
				budgetActions.toggleCourseCostsSection();
			};
		} // end link
	};
});
