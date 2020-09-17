import './addExpenseItem.css';

let addExpenseItem = function ($rootScope, BudgetActions) {
  return {
    restrict: 'E',
    template: require('./addExpenseItem.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '=',
      lineItemToEdit: '<?',
    },
    link: function (scope) {
      scope.newExpenseItem = {};

      if (scope.lineItemToEdit) {
        scope.newExpenseItem = angular.copy(scope.lineItemToEdit); // eslint-disable-line no-undef
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
        if (scope.lineItemToEdit && scope.lineItemToEdit.id > 0) {
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
