sharedApp.directive('budgetScenarioToolbar', function($window, $location, $routeParams, $rootScope, budgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		templateUrl: 'budgetScenarioToolbar.html', // directive html found here:
		replace: true, // Replace with the template
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.displayScenarioRenameUI = false;
			scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name);

			scope.openSupportCostModal = function() {
				budgetActions.toggleSupportCostModal();
			};

			scope.showScenarioRenameUI = function() {
				scope.displayScenarioRenameUI = true;
				scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name);
			};

			scope.cancelScenarioRename = function() {
				scope.displayScenarioRenameUI = false;
				scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name);
			};

			scope.saveNewScenarioName = function() {
				scope.state.selectedBudgetScenario.name = angular.copy(scope.newScenarioName);
				budgetActions.updateBudgetScenario(scope.state.selectedBudgetScenario);
			};
		} // End Link
	};
});