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
				budgetActions.openAddLineItemModal();
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

			scope.deleteLineItem = function(lineItem) {
				budgetActions.deleteLineItem(lineItem);
			};

			scope.updateLineItem = function(lineItem, propertyName) {
				budgetActions.toggleLineItemDetail(lineItem.id, propertyName);
				budgetActions.updateLineItem(lineItem);
			};

			scope.openAddLineItemCommentsModal = function(lineItem) {
				budgetActions.openAddLineItemCommentsModal(lineItem);
			};

			scope.selectLineItem = function(lineItem) {
				budgetActions.toggleSelectLineItem(lineItem);
			};
		} // end link
	};
});
