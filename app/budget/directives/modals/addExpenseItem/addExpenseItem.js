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

      // Validates the form and builds a custom message for the user
      scope.isFormValid = function () {
        scope.formValidationErrorMessage = '';
        if (
          !scope.newExpenseItem.expenseItemTypeId ||
          scope.newExpenseItem.expenseItemTypeId == 0
        ) {
          scope.formValidationErrorMessage += ' You must select a type.';
        }

        if (
          !scope.newExpenseItem.description ||
          scope.newExpenseItem.description.length < 1
        ) {
          scope.formValidationErrorMessage += ' You must add a description.';
        }

        if (!scope.newExpenseItem.termCode) {
          scope.formValidationErrorMessage += ' You must select a term.';
        }

        if (scope.formValidationErrorMessage.length > 0) {
          return false;
        }

        return true;
      };

      scope.selectExpenseItemType = function (type) {
        scope.newExpenseItem.expenseItemTypeId = type.id;
        scope.newExpenseItem.typeDescription = type.description;
      };

      scope.selectExpenseItemTerm = function (term) {
        scope.newExpenseItem.termCode = term.id;
        scope.newExpenseItem.termDescription = term.description;
      };

      scope.submitExpenseItemForm = function () {
        scope.newExpenseItem.budgetScenarioId =
          scope.state.selectedBudgetScenario.id;

        if (scope.expenseItemToEdit && scope.expenseItemToEdit.id > 0) {

          BudgetActions.updateExpenseItem(
            scope.newExpenseItem,
            scope.state.selectedBudgetScenario.id
          );
        } else {
          BudgetActions.createExpenseItem(
            scope.newExpenseItem,
            scope.state.selectedBudgetScenario.id,
            'Saved expense item'
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
