let groupCostConfig = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./groupCostConfig.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateBudget = function (budget) {
				BudgetActions.updateBudget(scope.state.budget);
			};

			scope.updateInstructorTypeCost = function(instructorTypeCost) {
				BudgetActions.createOrUpdateInstructorTypeCosts(instructorTypeCost);
			};
		}
	};
};

export default groupCostConfig;
