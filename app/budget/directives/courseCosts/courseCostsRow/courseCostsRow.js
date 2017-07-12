budgetApp.directive("courseCostsRow", this.courseCostsRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCostsRow.html',
		replace: true,
		scope: {
			activeBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {

		} // end link
	};
});
