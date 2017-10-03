budgetApp.directive("lineItems", this.lineItems = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'lineItems.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			ui: '<'
			// '<' This is proper one way binding, as opposed to string interpoation or passing value as a function that can be called
		},
		link: function (scope, element, attrs) {
			scope.toggleLineItemSection = function() {
				budgetActions.toggleLineItemSection();
			};

			scope.openAddLineItemModal = function() {
				budgetActions.toggleAddLineItemModal();
			};

			scope.selectAllLineItems = function(areAllLineItemsSelected) {
				if (areAllLineItemsSelected) {
					budgetActions.deselectAllLineItems();
				} else {
					budgetActions.selectAllLineItems(scope.selectedBudgetScenario.lineItems);
				}
			};

			scope.deleteLineItems = function() {
				budgetActions.deleteLineItems(scope.selectedBudgetScenario, scope.ui.selectedLineItems);
			};
		} // end link
	};
});
