budgetApp.directive("instructorCosts", this.instructorCosts = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCosts.html',
		replace: true,
		scope: {},
		link: function(scope, element, attrs) {
			// Empty intentionally
		}
	};
});