/**
 * Provides the main course table in the Courses View
 */
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
			}
		} // end link
	};
});
