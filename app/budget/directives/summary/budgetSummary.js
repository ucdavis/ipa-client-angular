budgetApp.directive("budgetSummary", this.budgetSummary = function ($rootScope, termService) {
	return {
		restrict: 'E',
		templateUrl: 'budgetSummary.html',
		replace: true,
		scope: {
			summary: '<'
		},
		link: function (scope, element, attrs) {
			scope.getTermName = function(term) {
				return termService.getShortTermName(term);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
});
