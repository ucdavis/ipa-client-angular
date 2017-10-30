budgetApp.directive("budgetSummary", this.budgetSummary = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'budgetSummary.html',
		replace: true,
		scope: {
			summary: '<',
			budget: '<'
		},
		link: function (scope, element, attrs) {
			scope.saveBudget = function () {
				budgetActions.updateBudget(scope.budget);
			};		} // end link
	};
});
