import './expenseItemDropdown.css';

let expenseItemDropdown = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./expenseItemDropdown.html'),
		replace: true,
		scope: {
			expenseItem: '<'
		},
		link: function (scope) {
			scope.openEditExpenseItemModal = function(expenseItem) {
				BudgetActions.openAddExpenseItemModal(expenseItem);
			};

			scope.deleteExpenseItem = function(expenseItem) {
				BudgetActions.deleteExpenseItem(expenseItem);

				// Ensure bootstrap dropdown closes properly when confirming deleting line item
				$(".line-item-dropdown").removeClass("open"); // eslint-disable-line no-undef
			};
		} // end link
	};
};

export default expenseItemDropdown;
