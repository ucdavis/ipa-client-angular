budgetApp.directive("supportCostRow", this.supportCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportCostRow.html',
		replace: true,
		scope: {
			activeBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {

		} // end link
	};
});
