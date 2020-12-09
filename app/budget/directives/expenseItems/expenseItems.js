import { toCurrency } from 'shared/helpers/string';

import './expenseItems.css';

let expenseItems = function ($rootScope, BudgetActions) {
  return {
    restrict: 'E',
    template: require('./expenseItems.html'),
    replace: true,
    scope: {
      selectedBudgetScenario: '<',
      ui: '<',
      expenseItems: '<',
      // '<' This is proper one way binding, as opposed to string interpoation or passing value as a function that can be called
    },
    link: function (scope) {
      scope.addExpenseItem = function (expenseItem) {
        BudgetActions.createExpenseItem(
          expenseItem,
          scope.selectedBudgetScenario.id,
          expenseItem.message
        );
      };

      scope.setActiveTab = function (activeTab) {
        BudgetActions.selectFundsNav(activeTab);
      };

      scope.toggleExpenseItemSection = function () {
        BudgetActions.toggleExpenseItemSection();
      };

      scope.openAddExpenseItemModal = function () {
        BudgetActions.openAddExpenseItemModal();
      };

      scope.selectAllExpenseItems = function (areAllExpenseItemsSelected) {
        if (areAllExpenseItemsSelected) {
          BudgetActions.deselectAllExpenseItems();
        } else {
          BudgetActions.selectAllExpenseItems(scope.expenseItems);
        }
      };

      scope.deleteExpenseItems = function () {
        BudgetActions.deleteExpenseItems(
          scope.selectedBudgetScenario,
          scope.ui.selectedExpenseItems
        );
      };

      scope.deleteExpenseItem = function (expenseItem) {
        BudgetActions.deleteExpenseItem(expenseItem);
      };

      scope.updateExpenseItem = function (expenseItem, propertyName) {
        BudgetActions.toggleExpenseItemDetail(expenseItem.id, propertyName);
        BudgetActions.updateExpenseItem(expenseItem);
      };

      scope.openAddExpenseItemCommentsModal = function (expenseItem) {
        BudgetActions.openAddExpenseItemCommentsModal(expenseItem);
      };

      scope.selectExpenseItem = function (expenseItem) {
        BudgetActions.toggleSelectExpenseItem(expenseItem);
      };

      scope.toCurrency = function (amount) {
        return toCurrency(amount);
      };
    }, // end link
  };
};

export default expenseItems;
