budgetApp.directive("budgetNav", this.budgetNav = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'budgetNav.html',
		replace: true,
		scope: {
			totalBalance: '<',
			selectedRoute: '<',
			selectedBudgetScenario: '<',
			selectedLineItems: '<'
		},
		link: function(scope, element, attrs) {
			scope.openAddLineItemModal = function() {
				budgetActions.openAddLineItemModal();
			};

			scope.deleteLineItems = function() {
				budgetActions.deleteLineItems(scope.selectedBudgetScenario, scope.selectedLineItems);
			};
		}
	};
});