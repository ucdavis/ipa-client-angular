import './downloadExcelModal.css';
import { _array_sortByProperty } from '../../../../shared/helpers/array';
import { dateToCalendar } from '../../../../shared/helpers/dates';

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
          scope.isSortedByRecentActivity = JSON.parse(localStorage.getItem("budgetComparisonDownloadSorted"));

          scope.downloadAllDepartments = scope.departmentScenarios.every(department => department.download === true);
        } else if (userWorkgroupsScenarios) {
          scope.departmentScenarios = scope.getScenarioOptions(userWorkgroupsScenarios);

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

      scope.getScenarioOptions = function(userWorkgroupsScenarios) {
        return Object.keys(userWorkgroupsScenarios)
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
      };

      scope.selectBudgetRequests = function() {
        scope.departmentScenarios = scope.departmentScenarios.map((ds) => {
          const currentBudgetRequest = ds.current.filter(scenario => scenario.isBudgetRequest === true).sort((a, b) => b.creationDate - a.creationDate)[0];
          const previousBudgetRequest = ds.previous.filter(scenario => scenario.isBudgetRequest === true).sort((a, b) => b.creationDate - a.creationDate)[0];

          if (currentBudgetRequest !== undefined) {
            ds.selectedCurrent = currentBudgetRequest.id.toString();
          } else {
            const liveDataScenario = ds.current.find(scenario => scenario.fromLiveData === true);
            ds.selectedCurrent = liveDataScenario.id.toString();
          }

          if (previousBudgetRequest !== undefined) {
            ds.selectedPrevious = previousBudgetRequest.id.toString();
          } else {
            const liveDataScenario = ds.previous.find(scenario => scenario.fromLiveData === true);
            ds.selectedPrevious = liveDataScenario.id.toString();
          }

          return ds;
        });
      };

      scope.resetDownloadSelections = function() {
        scope.departmentScenarios = scope.getScenarioOptions(scope.userWorkgroupsScenarios);
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
        localStorage.setItem("budgetComparisonDownloadSorted", JSON.stringify(scope.isSortedByRecentActivity));
      };

      scope.dateToCalendar = function (date) {
        return dateToCalendar(date);
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
