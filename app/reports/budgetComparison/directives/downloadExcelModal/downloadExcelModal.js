import './downloadExcelModal.css';
import { _array_sortByProperty } from '../../../../shared/helpers/array';

let downloadExcelModal = function (BudgetComparisonReportActions, BudgetComparisonReportService) {
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
      scope.isSortedByRecentActivity = false;

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
        if (localStorage.getItem("budgetComparisonDownloadSelections")) {
          scope.departmentScenarios = JSON.parse(localStorage.getItem("budgetComparisonDownloadSelections"));

          scope.downloadAllDepartments = scope.departmentScenarios.every(department => department.download === true);
        } else if (userWorkgroupsScenarios) {
          scope.departmentScenarios = Object.keys(userWorkgroupsScenarios)
            .sort()
            .map((department) => ({
              name: department,
              current: userWorkgroupsScenarios[department].current,
              previous: userWorkgroupsScenarios[department].previous,
              selectedPrevious: `${(userWorkgroupsScenarios[department].previous.find(scenario => scenario.fromLiveData === true) || {}).id}`,
              selectedCurrent: `${(userWorkgroupsScenarios[department].current.find(scenario => scenario.fromLiveData === true) || {}).id}`,
              lastModifiedOn: Math.max(...scope.userWorkgroupsScenarios[department].current.map(scenario => scenario.lastModifiedOn)),
              download: true
            }));

            scope.downloadAllDepartments = true;
        }
      }, true);

      scope.sortDepartmentsByRecentActivity = function() {
        if (scope.isSortedByRecentActivity === false) {
          scope.isSortedByRecentActivity = true;
          scope.departmentScenarios = _array_sortByProperty(scope.departmentScenarios, "lastModifiedOn", true);
        } else {
          scope.isSortedByRecentActivity = false;
          scope.departmentScenarios = _array_sortByProperty(scope.departmentScenarios, "name");
        }
      };

      scope.resetDownloadSelections = function() {
        scope.departmentScenarios.forEach(departmentScenarios => {
          departmentScenarios.download = true;
          departmentScenarios.selectedPrevious = `${departmentScenarios.previous.find(scenario => scenario.fromLiveData === true).id}`;
          departmentScenarios.selectedCurrent = `${departmentScenarios.current.find(scenario => scenario.fromLiveData === true).id}`;
        });
        scope.downloadAllDepartments = true;
      };

      scope.toggleAllDepartmentDownloads = function() {
        if (scope.downloadAllDepartments) {
          scope.departmentScenarios.forEach(department => department.download = false);
          scope.downloadAllDepartments = false;
        } else {
          scope.departmentScenarios.forEach(department => department.download = true);
          scope.downloadAllDepartments = true;
        }
      };

      scope.toggleDepartmentDownload = function (department) {
        department.download = !department.download;

        scope.downloadAllDepartments = scope.departmentScenarios.every(department => department.download === true);
      };

      scope.close = function () {
        scope.status = null;
        BudgetComparisonReportActions.toggleDownloadModal();
        localStorage.setItem("budgetComparisonDownloadSelections", JSON.stringify(scope.departmentScenarios));
      };

      scope.submit = function () {
        scope.isDisabled = true;
        let scenarioIdPairs = scope.departmentScenarios
          .filter(department => department.download)
          .map((department) => [
          { id: parseInt(department.selectedPrevious) },
          { id: parseInt(department.selectedCurrent) },
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

          scope.status = res.status;
          scope.isDisabled = false;
        });
      };
    }, // end link
  };
};

export default downloadExcelModal;
