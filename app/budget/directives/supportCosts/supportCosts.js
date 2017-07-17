budgetApp.directive("supportCosts", this.supportCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportCosts.html',
		replace: true,
		scope: {
			state: '<',
			budget: '<'
		},
		link: function (scope, element, attrs) {
			scope.newBudget = {};
			scope.newBudget.id = angular.copy(scope.budget.id);
			scope.newBudget.taCost = angular.copy(scope.budget.taCost);
			scope.newBudget.readerCost = angular.copy(scope.budget.readerCost);
			scope.newBudget.lecturerCost = angular.copy(scope.budget.lecturerCost);

			scope.saveBudget = function () {
				budgetActions.updateBudget(scope.newBudget);
			};
		} // end link
	};
});
