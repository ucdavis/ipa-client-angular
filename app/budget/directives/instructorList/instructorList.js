budgetApp.directive("instructorList", this.instructorList = function (budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorList.html',
		replace: true,
		scope: {
			state: '<',
			selectedBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {
			scope.view = {
				activeTab: 'Instructor Costs',
				allTabs: ['Instructor Costs', 'Group Costs']
			};

			scope.setActiveTab = function (activeTab) {
				scope.view.activeTab = activeTab;
			};

			scope.updateInstructorCost = function (instructorCost) {
				if (instructorCost.id > 0) {
					budgetActions.updateInstructorCost(instructorCost);
				} else {
					budgetActions.createInstructorCost(instructorCost);
				}
			};

			scope.updateBudget = function (budget) {
				budgetActions.updateBudget(scope.state.budget);
			};

			scope.updateInstructorTypeCost = function(instructorTypeCost) {
				budgetActions.createOrUpdateInstructorTypeCosts(instructorTypeCost);
			};
		}
	};
});
