import { dateToCalendar, dateToRelative } from 'shared/helpers/dates';

import './downloadBudgetScenarios.css';
import BudgetService from '../../../services/budgetService';

let downloadBudgetScenarios = function ($rootScope, BudgetActions, BudgetService) {
	return {
		restrict: 'E',
		template: require('./downloadBudgetScenarios.html'),
		replace: true,
		scope: {
			budgetScenarios: '<',
			userWorkgroupsScenarios: '<',
		},
		link: function (scope) {
			scope.newComment = "";
			scope.isDisabled = false;
			// {
			//   "DSS": [sceanrio1, 2, 3],
			//   "Design": [...]
			//  }
			scope.budgetScenariosAccessible = Object.keys(scope.userWorkgroupsScenarios).map(workgroup => ({
				id: workgroup,
				budgetScenarios: scope.userWorkgroupsScenarios[workgroup],
				selectedScenario: `${(scope.userWorkgroupsScenarios[workgroup].find(scenario => scenario.name === "Live Data") || {}).id}`
			}));

			scope.isFormValid = function() {
				if (scope.newComment.length > 0) {
					return true;
				}

				return false;
			};

			scope.dateToCalendar = function(date) {
				return dateToCalendar(date);
			};

			scope.dateToRelative = function(date) {
				return dateToRelative(date);
			};

			scope.selectBudgetScenario = function(scenario, department){
				console.log('On click', scenario);
				department.selectBudgetScenario = scenario;
				console.log('Update scope scenarios is ', scope.budgetScenariosAccessible);
			};

			scope.toggleExclude = function(department) {
				department.exclude = (department.exclude ? false : true);
			};

			scope.close = function() {
				BudgetActions.toggleBudgetScenarioModal();
			};

			scope.submit = function() {
				console.log("Submitting");
				// let scenarioIds = [];
				scope.isDisabled = true;
				let scenarioIds = scope.budgetScenariosAccessible.filter(scenario => parseInt(scenario.selectedScenario)).map(scenario => ({id: parseInt(scenario.selectedScenario)}));
				// debugger;
				BudgetService.downloadWorkgroupScenariosExcel(scenarioIds)
				.then(
					(response) => {
						var url = window.URL.createObjectURL(
							new Blob([response.data], { type: 'application/vnd.ms-excel' })
						);
						var a = window.document.createElement('a');
						a.href = url;
						a.download = 'Budget Report Download.xlsx';
						window.document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
						a.click();
						a.remove(); //afterwards we remove the element again

						if (response.status === 200){
							BudgetActions.toggleBudgetScenarioModal();
						}
						scope.isDisabled = false;
					}
				);

			};
		} // end link
	};
};

export default downloadBudgetScenarios;
