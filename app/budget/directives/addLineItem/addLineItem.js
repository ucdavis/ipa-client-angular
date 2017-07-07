/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("addLineItem", this.addLineItem = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addLineItem.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.newLineItem = {};

			scope.selectLineItemCategory = function(category) {

			};
			scope.submitLineItemForm = function () {
				budgetActions.createLineItem(scope.newLineItem, scope.state.activeBudgetScenario.id);
			};
		} // end link
	};
});
