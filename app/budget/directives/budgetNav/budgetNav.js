let budgetNav = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./budgetNav.html'),
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
				BudgetActions.setRoute(selectedRoute);
			};

			scope.openAddLineItemModal = function() {
				BudgetActions.openAddLineItemModal();
			};

			scope.deleteLineItems = function() {
				BudgetActions.deleteLineItems(scope.selectedBudgetScenario, scope.selectedLineItems);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
};

export default budgetNav;
