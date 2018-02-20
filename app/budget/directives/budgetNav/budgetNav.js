budgetApp.directive("budgetNav", this.budgetNav = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'budgetNav.html',
		replace: true,
		scope: {
			totalBalance: '<',
			selectedSection: '<',
			selectedBudgetScenario: '<',
			selectedLineItems: '<',
			filters: '<'
		},
		link: function(scope, element, attrs) {
			scope.setRoute = function(selectedRoute) {
				budgetActions.setRoute(selectedRoute);
			};

			scope.openAddLineItemModal = function() {
				budgetActions.openAddLineItemModal();
			};

			scope.deleteLineItems = function() {
				budgetActions.deleteLineItems(scope.selectedBudgetScenario, scope.selectedLineItems);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
});