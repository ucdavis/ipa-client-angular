budgetApp.directive("budgetSummary", this.budgetSummary = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'budgetSummary.html',
		replace: true,
		scope: {
			summary: '<'
		},
		link: function (scope, element, attrs) {
			scope.graphTitleText = "Total Costs ()";

			if (scope.summary && scope.summary.costsTotal) {
				scope.graphTitleText = "Total Costs (" + scope.summary.costsTotal + ")";
			}
		} // end link
	};
});
