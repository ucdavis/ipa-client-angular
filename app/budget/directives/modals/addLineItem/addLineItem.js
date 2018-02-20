budgetApp.directive("addLineItem", this.addLineItem = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addLineItem.html',
		replace: true,
		scope: {
			state: '<',
			isVisible: '=',
			lineItemToEdit: '<?'
		},
		link: function (scope, element, attrs) {
			scope.newLineItem = {};

			if (scope.lineItemToEdit) {
				scope.newLineItem = angular.copy(scope.lineItemToEdit);
			}

			scope.newLineItem.categoryDescription = scope.newLineItem.categoryDescription || "Select a category";

			// Validates the form and builds a custom message for the user
			scope.isFormValid = function() {
				scope.formValidationErrorMessage = "";
				if (!(scope.newLineItem.lineItemCategoryId) || scope.newLineItem.lineItemCategoryId == 0) {
					scope.formValidationErrorMessage += " You must select a category.";
				}

				if (!(scope.newLineItem.description) || scope.newLineItem.description.length < 1) {
					scope.formValidationErrorMessage += " You must add a description.";
				}

				if (scope.formValidationErrorMessage.length > 0) {
					return false;
				}

				return true;
			};


			scope.selectLineItemCategory = function(category) {
				scope.newLineItem.lineItemCategoryId = category.id;
				scope.newLineItem.categoryDescription = category.description;
			};

			scope.submitLineItemForm = function () {
				scope.newLineItem.budgetScenarioId = scope.state.selectedBudgetScenario.id;
				if (scope.lineItemToEdit && scope.lineItemToEdit.id > 0) {
					budgetActions.updateLineItem(scope.newLineItem, scope.state.selectedBudgetScenario.id);
				} else {
					budgetActions.createLineItem(scope.newLineItem, scope.state.selectedBudgetScenario.id);
				}
			};

			scope.close = function() {
				scope.isVisible = false;
			};
		} // end link
	};
});
