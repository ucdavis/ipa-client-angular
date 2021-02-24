import './downloadBudgetScenarios.css';
import { dateToCalendar } from '../../../../shared/helpers/dates';
import { _array_sortByProperty } from '../../../../shared/helpers/array';

let downloadBudgetScenarios = function ($rootScope, BudgetActions, BudgetService) {
	return {
		restrict: 'E',
		template: require('./downloadBudgetScenarios.html'),
		replace: true,
		scope: {
			year: '<',
			budgetScenarios: '<',
			userWorkgroupsScenarios: '<',
		},
		link: function (scope) {
			scope.isDisabled = false;
			scope.status = null;
			scope.isSortedByRecentActivity = false;
			// {
			//   "DSS": [sceanrio1, 2, 3],
			//   "Design": [...]
			//  }

			scope.sortDepartmentsByRecentActivity = function() {
				if (scope.isSortedByRecentActivity === false) {
					scope.isSortedByRecentActivity = true;
					scope.budgetScenariosAccessible = _array_sortByProperty(scope.budgetScenariosAccessible, "lastModifiedOn", true);
				} else {
					scope.isSortedByRecentActivity = false;
					scope.budgetScenariosAccessible = _array_sortByProperty(scope.budgetScenariosAccessible, "id");
				}
			};

			scope.selectBudgetScenario = function(scenario, department){
				department.selectBudgetScenario = scenario;
			};

			if (localStorage.getItem("budgetDownloadSelections") && localStorage.getItem("budgetDownloadSelectionsYear") === scope.year) {
				scope.budgetScenariosAccessible = JSON.parse(localStorage.getItem("budgetDownloadSelections"));
				scope.isSortedByRecentActivity = JSON.parse(localStorage.getItem("budgetDownloadSorted"));

				scope.downloadAllDepartments = scope.budgetScenariosAccessible.every(department => department.download === true);
			} else {
				scope.budgetScenariosAccessible = Object.keys(scope.userWorkgroupsScenarios)
					.sort()
					.map(workgroup => ({
						id: workgroup,
						budgetScenarios: scope.userWorkgroupsScenarios[workgroup],
						selectedScenario: `${(scope.userWorkgroupsScenarios[workgroup].find(scenario => scenario.fromLiveData === true) || {}).id}`,
						lastModifiedOn: Math.max(...scope.userWorkgroupsScenarios[workgroup].map(scenario => scenario.lastModifiedOn)),
						download: true
					}));

				scope.downloadAllDepartments = true;
			}

			scope.selectBudgetRequests = function() {
				scope.budgetScenariosAccessible = scope.budgetScenariosAccessible.map((department) => {
					const budgetRequest = department.budgetScenarios.filter(scenario => scenario.isBudgetRequest === true).sort((a, b) => b.creationDate - a.creationDate)[0];

					if (budgetRequest !== undefined) {
						department.selectedScenario = budgetRequest.id.toString();
					} else {
						const liveDataScenario = department.budgetScenarios.find(scenario => scenario.fromLiveData === true);
						department.selectedScenario = liveDataScenario.id.toString();
					}
					
					return department;
				});
			};
			
			scope.resetDownloadSelections = function() {
				scope.budgetScenariosAccessible.forEach(department => {
					department.selectedScenario = `${(department.budgetScenarios.find(scenario => scenario.fromLiveData === true) || {}).id}`;
					department.download = true;
				});

				scope.downloadAllDepartments = true;
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

				scope.downloadAllDepartments = scope.budgetScenariosAccessible.every(department => department.download === true);
			};

			scope.dateToCalendar = function(date) {
				return dateToCalendar(date);
			};

			scope.close = function() {
				BudgetActions.toggleBudgetScenarioModal();
				localStorage.setItem("budgetDownloadSelections", JSON.stringify(scope.budgetScenariosAccessible));
				localStorage.setItem("budgetDownloadSelectionsYear", JSON.stringify(scope.year));
				localStorage.setItem("budgetDownloadSorted", JSON.stringify(scope.isSortedByRecentActivity));
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
