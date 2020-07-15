import './downloadBudgetScenarios.css';

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
			scope.budgetScenariosAccessible = Object.keys(scope.userWorkgroupsScenarios).map(workgroup => ({
				id: workgroup,
				budgetScenarios: scope.userWorkgroupsScenarios[workgroup],
				selectedScenario: `${(scope.userWorkgroupsScenarios[workgroup].find(scenario => scenario.name === "Live Data") || {}).id}`
			}));

			scope.selectBudgetScenario = function(scenario, department){
				department.selectBudgetScenario = scenario;
			};

			scope.toggleExclude = function(department) {
				department.exclude = (department.exclude ? false : true);
			};

			scope.close = function() {
				BudgetActions.toggleBudgetScenarioModal();
			};

			scope.submit = function() {
				scope.isDisabled = true;
				let scenarioIds = scope.budgetScenariosAccessible.filter(scenario => parseInt(scenario.selectedScenario)).map(scenario => ({id: parseInt(scenario.selectedScenario)}));

				BudgetService.downloadWorkgroupScenariosExcel(scenarioIds)
				.then(
					(response) => {
						$rootScope.$emit('toast-clear');

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
