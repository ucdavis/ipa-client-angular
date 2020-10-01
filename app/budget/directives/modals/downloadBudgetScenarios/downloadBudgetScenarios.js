import './downloadBudgetScenarios.css';
import { dateToCalendar } from '../../../../shared/helpers/dates';

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
			scope.isDisabled = false;
			scope.status = null;
			// {
			//   "DSS": [sceanrio1, 2, 3],
			//   "Design": [...]
			//  }

			if (localStorage.getItem("budgetDownloadSelections")) {
				scope.budgetScenariosAccessible = JSON.parse(localStorage.getItem("budgetDownloadSelections"));

				scope.downloadAllDepartments = scope.budgetScenariosAccessible.every(department => department.download == true);
			} else {
				scope.budgetScenariosAccessible = Object.keys(scope.userWorkgroupsScenarios)
					.sort()
					.map(workgroup => ({
						id: workgroup,
						budgetScenarios: scope.userWorkgroupsScenarios[workgroup],
						selectedScenario: `${(scope.userWorkgroupsScenarios[workgroup].find(scenario => scenario.name === "Live Data") || {}).id}`,
						download: true
					}));

				scope.downloadAllDepartments = true;
			}

			scope.selectBudgetScenario = function(scenario, department){
				department.selectBudgetScenario = scenario;
			};

			scope.toggleAllDepartmentDownload = function() {
				if (scope.downloadAllDepartments) {
					scope.budgetScenariosAccessible.forEach(department => department.download = false);
					scope.downloadAllDepartments = false;
				} else {
					scope.budgetScenariosAccessible.forEach(department => department.download = true);
					scope.downloadAllDepartments = true;
				}
			};

			scope.toggleDepartmentDownload = function(department) {
				department.download = !department.download;

				scope.downloadAllDepartments = scope.budgetScenariosAccessible.every(department => department.download == true);
			};

			scope.dateToCalendar = function(date) {
				return dateToCalendar(date);
			};

			scope.close = function() {
				BudgetActions.toggleBudgetScenarioModal();
				localStorage.setItem("budgetDownloadSelections", JSON.stringify(scope.budgetScenariosAccessible));
			};

			scope.submit = function() {
				scope.isDisabled = true;
				let scenarioIds = scope.budgetScenariosAccessible
					.filter(department => department.download && parseInt(department.selectedScenario))
					.map(department => ({id: parseInt(department.selectedScenario)}));

				BudgetService.downloadWorkgroupScenariosExcel(scenarioIds)
				.then(
					(response) => {
						var url = window.URL.createObjectURL(
							new Blob([response.data], { type: 'application/vnd.ms-excel' })
						);
						var a = window.document.createElement('a'); // eslint-disable-line
						a.href = url;
						a.download = 'Budget Report Download.xlsx';
						window.document.body.appendChild(a); // eslint-disable-line
						a.click();
						a.remove(); //afterwards we remove the element again

						scope.status = response.status;
						scope.isDisabled = false;
					}
				);
			};
		} // end link
	};
};

export default downloadBudgetScenarios;
