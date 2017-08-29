budgetApp.directive("budgetSummary", this.budgetSummary = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'budgetSummary.html',
		replace: true,
		scope: {
			summary: '<'
		},
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
});
