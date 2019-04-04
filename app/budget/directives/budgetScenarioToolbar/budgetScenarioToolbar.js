import { setCharAt } from 'shared/helpers/string';

import './budgetScenarioToolbar.css';

let budgetScenarioToolbar = function($window, $location, $routeParams, $rootScope, BudgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		template: require('./budgetScenarioToolbar.html'), // directive html found here:
		replace: true, // Replace with the template
		
		scope: {
			state: '<',
			printBudget: '&',
		},
		link: function (scope) {
			scope.displayScenarioRenameUI = false;
			scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name); // eslint-disable-line no-undef
			scope.isNewScenarioNameValid = true;
			scope.validationError = "";
			scope.printingMode = false;

			scope.openSupportCostModal = function() {
				BudgetActions.toggleSupportCostModal();
			};

			scope.openBudgetConfigModal = function() {
				BudgetActions.openBudgetConfigModal();
			};

			scope.showScenarioRenameUI = function() {
				scope.displayScenarioRenameUI = true;
				scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name); // eslint-disable-line no-undef
			};

			scope.cancelScenarioRename = function() {
				scope.displayScenarioRenameUI = false;
				scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name); // eslint-disable-line no-undef
			};

			scope.saveNewScenarioName = function() {
				scope.state.selectedBudgetScenario.name = angular.copy(scope.newScenarioName); // eslint-disable-line no-undef
				BudgetActions.updateBudgetScenario(scope.state.selectedBudgetScenario);
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

			scope.updateCourseTag = function (tag) {
				tag.selected = !tag.selected;
				BudgetActions.updateCourseTag(tag);
			};

			scope.selectBudgetScenarioTerm = function(term) {
				var index = parseInt(term) - 1;
				var newValue = scope.state.selectedBudgetScenario.activeTermsBlob[index] == "1" ? "0" : "1";
				scope.state.selectedBudgetScenario.activeTermsBlob = setCharAt(scope.state.selectedBudgetScenario.activeTermsBlob, index, newValue);
				BudgetActions.updateBudgetScenario(scope.state.selectedBudgetScenario);
			};

			scope.print = function() {
				scope.$parent.printingBudget = !scope.$parent.printingBudget ;
				// window.print();
				
			};

		} // End Link
	};
};

export default budgetScenarioToolbar;
