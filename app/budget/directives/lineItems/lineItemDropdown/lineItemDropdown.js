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
		} // end link
	};
});
