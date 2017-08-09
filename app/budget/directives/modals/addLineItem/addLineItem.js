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
			scope.newLineItem.categoryDescription = "Select a category";

			scope.selectLineItemCategory = function(category) {
				scope.newLineItem.lineItemCategoryId = category.id;
				scope.newLineItem.categoryDescription = category.description;
			};
			scope.submitLineItemForm = function () {
				scope.newLineItem.budgetScenarioId = scope.state.selectedBudgetScenario.id;

				budgetActions.createLineItem(scope.newLineItem, scope.state.selectedBudgetScenario.id);
			};
		} // end link
	};
});
