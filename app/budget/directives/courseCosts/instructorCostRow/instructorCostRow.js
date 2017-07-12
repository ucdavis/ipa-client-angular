budgetApp.directive("instructorCostRow", this.instructorCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCostRow.html',
		replace: true,
		scope: {
			activeBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {

		} // end link
	};
});
