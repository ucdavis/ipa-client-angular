/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("lineItems", this.lineItems = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'lineItems.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<'
			// '<' This is proper one way binding, as opposed to string interpoation or passing value as a function that can be called
		},
		link: function (scope, element, attrs) {
			scope.toggleLineItemSection = function() {
				budgetActions.toggleLineItemSection();
			};
		} // end link
	};
});
