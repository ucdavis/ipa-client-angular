import './addExpenseItem.css';

let addExpenseItem = function ($rootScope, BudgetActions) {
  return {
    restrict: 'E',
    template: require('./addExpenseItem.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '=',
      expenseItemToEdit: '<?',
    },
    link: function (scope) {
      scope.newExpenseItem = {};

      if (scope.expenseItemToEdit) {
        scope.newExpenseItem = angular.copy(scope.expenseItemToEdit); // eslint-disable-line no-undef
      }

      scope.newExpenseItem.categoryDescription =
        scope.newExpenseItem.categoryDescription || 'Select a category';

      // Validates the form and builds a custom message for the user
      scope.isFormValid = function () {
        scope.formValidationErrorMessage = '';
        if (
          !scope.newExpenseItem.lineItemCategoryId ||
          scope.newExpenseItem.lineItemCategoryId == 0
        ) {
          scope.formValidationErrorMessage += ' You must select a category.';
        }

        if (
          !scope.newExpenseItem.description ||
          scope.newExpenseItem.description.length < 1
        ) {
          scope.formValidationErrorMessage += ' You must add a description.';
        }

        if (scope.formValidationErrorMessage.length > 0) {
          return false;
        }

        return true;
      };

      scope.selectLineItemCategory = function (category) {
        scope.newExpenseItem.lineItemCategoryId = category.id;
        scope.newExpenseItem.categoryDescription = category.description;
      };

      scope.submitLineItemForm = function () {
        scope.newExpenseItem.budgetScenarioId =
          scope.state.selectedBudgetScenario.id;
        if (scope.expenseItemToEdit && scope.expenseItemToEdit.id > 0) {
          BudgetActions.updateLineItem(
            scope.newExpenseItem,
            scope.state.selectedBudgetScenario.id
          );
        } else {
          BudgetActions.createLineItem(
            scope.newExpenseItem,
            scope.state.selectedBudgetScenario.id,
            'Saved line item'
          );
        }
      };

      scope.close = function () {
        scope.isVisible = false;
      };
    }, // end link
  };
};

export default addExpenseItem;
