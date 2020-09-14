import { setCharAt } from 'shared/helpers/string';
import { dateToCalendar } from '../../../shared/helpers/dates';

import './budgetScenarioToolbar.css';

let budgetScenarioToolbar = function($window, $location, $routeParams, $rootScope, BudgetActions, BudgetService) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		template: require('./budgetScenarioToolbar.html'), // directive html found here:
		replace: true, // Replace with the template

		scope: {
			state: '<'
		},
		link: function (scope) {
			scope.displayScenarioRenameUI = false;
			scope.newScenarioName = angular.copy(scope.state.selectedBudgetScenario.name); // eslint-disable-line no-undef
			scope.isNewScenarioNameValid = true;
			scope.validationError = "";
			scope.activeFilters = [];
			scope.showTermChip = false;
			scope.snapshotInProgress = false;

			$rootScope.$on('budgetStateChanged', function (event, data) {
				scope.snapshotInProgress = data.ui.createInProgress;
			});

			$window.onscroll = function () {
				const VERTICAL_OFFSET = 98;
				scope.showTermChip = this.scrollY > VERTICAL_OFFSET;
				scope.$apply();
			};

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

			scope.createBudgetScenarioSnapshot = function() {
				scope.snapshotInProgress = true;
				BudgetActions.createBudgetScenarioSnapshot(scope.state.selectedBudgetScenario);
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

			scope.updateFilter = function (filter) {
				filter.selected = !filter.selected;

				scope.activeFilters = scope.state.ui.filters.list.filter(function (filter) {
					return filter.selected;
				});

				BudgetActions.updateFilter(filter);
			};

			scope.toggleFilter = function(description) {
				let filter = scope.state.ui.filters.list.find(function(option) {
					return option.description == description;
				});

				filter.selected = !filter.selected;

				scope.activeFilters = scope.state.ui.filters.list.filter(
					function(filter) {
						return filter.selected;
					}
				);

				BudgetActions.updateFilter(filter);
			};

			scope.selectBudgetScenarioTerm = function(term) {
				var index = parseInt(term) - 1;
				var newValue = scope.state.selectedBudgetScenario.activeTermsBlob[index] == "1" ? "0" : "1";
				scope.state.selectedBudgetScenario.activeTermsBlob = setCharAt(scope.state.selectedBudgetScenario.activeTermsBlob, index, newValue);
				BudgetActions.updateBudgetScenario(scope.state.selectedBudgetScenario);
			};

			scope.downloadBudgetExcel = function() {
				BudgetActions.downloadBudgetExcel(scope.state);
			};

			scope.print = function() {
				window.print();
			};

			scope.syncBudgetScenario = function() {
				BudgetActions.syncBudgetScenario();
			};

			scope.setBudgetScenarioTerm = ( item ) => {
				BudgetActions.selectTerm( item.description );
				$window.scrollTo(0, 0);
			};

			scope.getCurrentScenario = function(){
				return scope.state.selectedBudgetScenario.name;
			};

			scope.dateToCalendar = function (date) {
				return dateToCalendar(date);
			};

			scope.downloadBudgetScenarioExcel = function(isAll) {
				if (isAll) {
					BudgetActions.toggleBudgetScenarioModal();
				} else {
					BudgetService.downloadWorkgroupScenariosExcel([{id: scope.state.selectedBudgetScenario.id}])
					.then(response => {
						var url = window.URL.createObjectURL(
							new Blob([response.data], { type: 'application/vnd.ms-excel' })
						);
						var a = window.document.createElement('a'); // eslint-disable-line
						a.href = url;
						var workgroupInfo = JSON.parse(localStorage.getItem('workgroup'));
						a.download = `Budget-Report-${workgroupInfo.name}-${localStorage.getItem('year')}-${scope.state.selectedBudgetScenario.name}-${scope.state.selectedBudgetScenario.isSnapshot ? 'SNAPSHOT-' + dateToCalendar(scope.state.selectedBudgetScenario.creationDate) : ''}.xlsx`;
						window.document.body.appendChild(a); // eslint-disable-line
						a.click();
						a.remove();  //afterwards we remove the element again
					});
				}
			};

		} // End Link
	};
};

export default budgetScenarioToolbar;
