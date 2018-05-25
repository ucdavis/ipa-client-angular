import './lineItems.css';

let lineItems = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./lineItems.html'),
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			ui: '<',
			lineItems: '<'
			// '<' This is proper one way binding, as opposed to string interpoation or passing value as a function that can be called
		},
		link: function (scope, element, attrs) {
			scope.toggleLineItemSection = function() {
				BudgetActions.toggleLineItemSection();
			};

			scope.openAddLineItemModal = function() {
				BudgetActions.openAddLineItemModal();
			};

			scope.selectAllLineItems = function(areAllLineItemsSelected) {
				if (areAllLineItemsSelected) {
					BudgetActions.deselectAllLineItems();
				} else {
					BudgetActions.selectAllLineItems(scope.lineItems);
				}
			};

			scope.deleteLineItems = function() {
				BudgetActions.deleteLineItems(scope.selectedBudgetScenario, scope.ui.selectedLineItems);
			};

			scope.deleteLineItem = function(lineItem) {
				BudgetActions.deleteLineItem(lineItem);
			};

			scope.unHideLineItem = function(lineItem) {
				lineItem.hidden = false;
				BudgetActions.updateLineItem(lineItem);
			};

			scope.updateLineItem = function(lineItem, propertyName) {
				BudgetActions.toggleLineItemDetail(lineItem.id, propertyName);
				BudgetActions.updateLineItem(lineItem);
			};

			scope.openAddLineItemCommentsModal = function(lineItem) {
				BudgetActions.openAddLineItemCommentsModal(lineItem);
			};

			scope.selectLineItem = function(lineItem) {
				BudgetActions.toggleSelectLineItem(lineItem);
			};

			scope.toCurrency = function(amount) {
				return toCurrency(amount);
			};
		} // end link
	};
};

export default lineItems;
