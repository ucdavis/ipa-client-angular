import './addLineItem.css';

let addLineItem = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./addLineItem.html'),
		replace: true,
		scope: {
			state: '<',
			isVisible: '=',
			lineItemToEdit: '<?'
		},
		link: function (scope) {
			scope.newLineItem = {};

			if (scope.lineItemToEdit) {
				scope.newLineItem = angular.copy(scope.lineItemToEdit); // eslint-disable-line no-undef
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
					BudgetActions.updateLineItem(scope.newLineItem, scope.state.selectedBudgetScenario.id);
				} else {
					BudgetActions.createLineItem(scope.newLineItem, scope.state.selectedBudgetScenario.id, "Saved line item");
				}
			};

			scope.close = function() {
				scope.isVisible = false;
			};
		} // end link
	};
};

export default addLineItem;
