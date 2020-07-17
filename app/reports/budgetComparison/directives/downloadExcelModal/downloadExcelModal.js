import './downloadExcelModal.css';

let downloadExcelModal = function (
  $rootScope,
  BudgetComparisonReportActions
) {
  return {
    restrict: 'E',
    template: require('./downloadExcelModal.html'),
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
      scope.budgetScenariosAccessible = Object.keys(
        scope.userWorkgroupsScenarios
      ).map((workgroup) => ({
        id: workgroup,
        budgetScenarios: scope.userWorkgroupsScenarios[workgroup],
        selectedScenario: `${
          (
            scope.userWorkgroupsScenarios[workgroup].find(
              (scenario) => scenario.name === 'Live Data'
            ) || {}
          ).id
        }`,
      }));

      scope.selectBudgetScenario = function (scenario, department) {
        department.selectBudgetScenario = scenario;
      };

      scope.close = function () {
        BudgetComparisonReportActions.toggleBudgetScenarioModal();
      };

      scope.submit = function () {
        scope.isDisabled = true;
        let scenarioIdPairs = scope.budgetScenariosAccessible
          .filter((scenario) => parseInt(scenario.selectedScenario))
          .map((scenario) => ({ id: parseInt(scenario.selectedScenario) }));

        BudgetComparisonReportActions.downloadBudgetComparisonExcel(scenarioIdPairs);
      };
    }, // end link
  };
};

export default downloadExcelModal;
