import './downloadExcelModal.css';

let downloadExcelModal = function (BudgetComparisonReportActions) {
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
      scope.previousYear = (parseInt(localStorage.getItem('year')) - 1).toString().yearToAcademicYear();
      scope.currentYear = localStorage.getItem('year').yearToAcademicYear();

      // {
      //   "DSS": {
      //     previous: [sceanrio1, 2, 3],
      //     current: [sceanrio1, 2, 3]
      //   }
      //   "Design": {
      //     previous: [...],
      //     current: []
      //   }
      // }
      scope.$watch('userWorkgroupsScenarios', function(userWorkgroupsScenarios) {
        if (userWorkgroupsScenarios) {
          scope.departmentScenarios = Object.keys(
            userWorkgroupsScenarios
          ).map((department) => ({
            name: department,
            current: userWorkgroupsScenarios[department].current,
            previous: userWorkgroupsScenarios[department].previous,
            selectedPrevious: `${(userWorkgroupsScenarios[department].previous.find(scenario => scenario.name === 'Live Data') || {}).id}`,
            selectedCurrent: `${(userWorkgroupsScenarios[department].current.find(scenario => scenario.name === 'Live Data') || {}).id}`
          }));
        }
      }, true);

      scope.close = function () {
        BudgetComparisonReportActions.toggleDownloadModal();
      };

      scope.submit = function () {
        scope.isDisabled = true;
        let scenarioIdPairs = scope.departmentScenarios.map((scenario) => [
          { id: parseInt(scenario.selectedPrevious) },
          { id: parseInt(scenario.selectedCurrent) },
        ]);

        BudgetComparisonReportActions.downloadBudgetComparisonExcel(scenarioIdPairs);
      };
    }, // end link
  };
};

export default downloadExcelModal;
