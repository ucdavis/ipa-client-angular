budgetApp.directive("lineItemRow", this.lineItemRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'lineItemRow.html',
		replace: true,
		scope: {
			lineItem: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleLineItem = function(lineItem) {
				budgetActions.toggleLineItem(lineItem);
			};

			scope.deleteLineItem = function(lineItem) {
				budgetActions.deleteLineItem(lineItem);
			};

			scope.updateLineItem = function(lineItem, propertyName) {
				budgetActions.toggleLineItemDetail(lineItem.id, propertyName);
				budgetActions.updateLineItem(lineItem);
			};

			scope.displayProperty = function(lineItemId, propertyName) {
				budgetActions.toggleLineItemDetail(lineItemId, propertyName);
			};

			scope.openAddLineItemCommentsModal = function(lineItem) {
				budgetActions.openAddLineItemCommentsModal(lineItem);
			};

			scope.dateToCalendar = function(date) {
				return dateToCalendar(date);
			};

			scope.dateToRelative = function(date) {
				return dateToRelative(date);
			};
		} // end link
	};
});
