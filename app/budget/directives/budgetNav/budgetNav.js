budgetApp.directive("budgetNav", this.budgetNav = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'budgetNav.html',
		replace: true,
		scope: {
			totalBalance: '<',
			selectedRoute: '<'
		},
		link: function(scope, element, attrs) {
			scope.setRoute = function(routeToken) {
				budgetActions.setRoute(routeToken);
			};
		}
	};
});