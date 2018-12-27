import './instructorList.css';

let instructorList = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./instructorList.html'),
		replace: true,
		scope: {
			state: '<',
			selectedBudgetScenario: '<'
		},
		link: function (scope) {
			scope.view = {
				activeTab: 'Salaries',
				allTabs: ['Salaries', 'Category Costs']
			};

			scope.setActiveTab = function (activeTab) {
				scope.view.activeTab = activeTab;
			};

			scope.updateInstructorCost = function (instructorCost) {
				if (instructorCost.id > 0) {
					BudgetActions.updateInstructorCost(instructorCost);
				} else {
					BudgetActions.createInstructorCost(instructorCost);
				}
			};

			scope.updateBudget = function () {
				BudgetActions.updateBudget(scope.state.budget);
			};

			scope.updateInstructorTypeCost = function(instructorTypeCost) {
				BudgetActions.createOrUpdateInstructorTypeCosts(instructorTypeCost);
			};
		}
	};
};

export default instructorList;
