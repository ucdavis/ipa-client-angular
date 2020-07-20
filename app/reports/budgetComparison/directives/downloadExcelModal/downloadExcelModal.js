import './downloadExcelModal.css';

let downloadExcelModal = function (BudgetComparisonReportActions, BudgetComparisonReportService) {
  return {
    restrict: 'E',
    template: require('./downloadExcelModal.html'),
    replace: true,
    scope: {
      budgetScenarios: '<',
      userWorkgroupsScenarios: '<',
      downloadStatus: '='
    },
    link: function (scope) {
      scope.isDisabled = false;
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

        BudgetComparisonReportService.downloadBudgetComparisonExcel(scenarioIdPairs).then((res) => {
          var url = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/vnd.ms-excel' })
          );
          var a = window.document.createElement('a'); // eslint-disable-line angular/document-service
          a.href = url;
          a.download = 'Budget Comparison Report Download.xlsx';
          window.document.body.appendChild(a); // eslint-disable-line angular/document-service
          a.click();
          a.remove(); //afterwards we remove the element again

          scope.downloadStatus = res.status;
          scope.isDisabled = false;
        });
      };
    }, // end link
  };
};

export default downloadExcelModal;
