budgetApp.directive("groupCostConfig", this.groupCostConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'groupCostConfig.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.newInstructorType = {
				budgetId: scope.state.budget.id,
				cost: 0,
				description: null,
				validationError: null
			};

			scope.updateBudget = function (budget) {
				budgetActions.updateBudget(scope.state.budget);
			};

			scope.updateInstructorType = function(instructorType) {
				budgetActions.updateInstructorType(instructorType);
			};
		}
	};
});
