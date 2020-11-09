import { toCurrency } from 'shared/helpers/string';

import './budgetNav.css';

let budgetNav = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./budgetNav.html'),
		replace: true,
		scope: {
			totalBalance: '<',
			selectedSection: '<',
			selectedBudgetScenario: '<',
			selectedLineItems: '<',
			selectedExpenseItems: '<',
			filters: '<',
			fundsNav: '<',
			shouldShowCourseList: '<'
		},
		link: function(scope) {
			scope.setRoute = function(selectedRoute) {
				BudgetActions.setRoute(selectedRoute);
			};

			scope.openAddLineItemModal = function() {
				BudgetActions.openAddLineItemModal();
			};

			scope.openAddExpenseItemModal = function() {
				BudgetActions.openAddExpenseItemModal();
			};


			scope.openAddCourseModal = function() {
				BudgetActions.openAddCourseModal();
			};

			scope.deleteLineItems = function() {
				BudgetActions.deleteLineItems(scope.selectedBudgetScenario, scope.selectedLineItems);
			};

			scope.deleteExpenses = function() {
				BudgetActions.deleteExpenses(scope.selectedBudgetScenario, scope.selectedExpenseItems);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
};

export default budgetNav;
