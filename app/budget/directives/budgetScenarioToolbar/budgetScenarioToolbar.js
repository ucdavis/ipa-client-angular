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
			scope.isNewScenarioNameValid = true;
			scope.validationError = "";

			scope.openSupportCostModal = function() {
				budgetActions.toggleSupportCostModal();
			};

			scope.openBudgetConfigModal = function() {
				budgetActions.openBudgetConfigModal();
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
				scope.displayScenarioRenameUI = false;
			};

			// Verifies that name is unique (within budgets for that schedule) and at least 1 character long.
			// Will generate an appropriate error message if this is not the case.
			scope.scenarioNameIsValid = function () {
				scope.validationError = "";

				var isNamePresent = (scope.newScenarioName.length > 0);

				if (isNamePresent == false) {
					scope.validationError = "Enter a name";
				}
				var isNameInUse = scope.state.budgetScenarios.some(function(scenario) {
					return (scenario.name == scope.newScenarioName);
				});

				if (isNameInUse) {
					scope.validationError = "Name already in use";
				}

				scope.isNewScenarioNameValid = isNamePresent && (isNameInUse == false);
			};
		} // End Link
	};
});
