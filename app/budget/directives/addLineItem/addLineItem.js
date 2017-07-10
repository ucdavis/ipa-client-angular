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
			scope.newLineItem.categoryDescription = "Select a category";
			scope.newLineItem.budgetScenarioId = scope.state.activeBudgetScenario.id;

			scope.selectLineItemCategory = function(category) {
				scope.newLineItem.lineItemCategoryId = category.id;
				scope.newLineItem.categoryDescription = category.description;
			};
			scope.submitLineItemForm = function () {
				// TODO: ipa-modal should ideally be in charge of modal UI changes, and this directive should not have to worry about cleanup
				$('body').css('overflow-y','visible');

				budgetActions.createLineItem(scope.newLineItem, scope.state.activeBudgetScenario.id);
			};
		} // end link
	};
});
