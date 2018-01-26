budgetApp.directive("lineItemDropdown", this.lineItemDropdown = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'lineItemDropdown.html',
		replace: true,
		scope: {
			lineItem: '<'
		},
		link: function (scope, element, attrs) {
			scope.openEditLineItemModal = function(lineItem) {
				budgetActions.openAddLineItemModal(lineItem);
			};

			scope.deleteLineItem = function(lineItem) {
				budgetActions.deleteLineItem(lineItem);

				// Ensure bootstrap dropdown closes properly when confirming deleting line item
				$(this).closest(".line-item-edit-dropdown").prev().dropdown("toggle");
			};
		} // end link
	};
});
