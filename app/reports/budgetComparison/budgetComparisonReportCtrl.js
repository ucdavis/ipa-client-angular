import './budgetComparisonReport.css';

class BudgetComparisonReportCtrl {
  constructor ($scope, $rootScope, $routeParams, validate, AuthService, BudgetComparisonReportActions, BudgetComparisonReportService) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;

    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;
    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.view = {};
    $scope.activeFilters = [];

    $rootScope.$on('budgetComparisonReportStateChanged', function (event, data) {
      $scope.view.state = data.state;
    });

    $scope.toggleFilter = function(filter) {
      filter.selected = !filter.selected;

      $scope.activeFilters = $scope.view.state.ui.filters.filter(function(filter) {
        return filter.selected;
      });

      BudgetComparisonReportActions.toggleFilter(filter);
    };

    $scope.removeToken = function(filter) {
        $scope.activeFilters = $scope.activeFilters.filter(function(slotFilter) {
          return slotFilter.description !== filter.description;
        });

        $scope.toggleFilter(filter);
    };

    $scope.closeDownloadModal = function() {
      BudgetComparisonReportActions.toggleDownloadModal();
    };

    $scope.downloadBudgetComparisonExcel = function(isMany) {
      if (isMany) {
        BudgetComparisonReportActions.toggleDownloadModal();
      } else {
        // old frontend excel download method
        // BudgetComparisonReportActions.downloadAsExcel($scope.year, $scope.sharedState.workgroup.name);

        let scenarioIdPair = [
          [
            { id: $scope.view.state.budgetScenarios.previousSelectedScenarioId },
            { id: $scope.view.state.budgetScenarios.currentSelectedScenarioId }
          ]
        ];

        BudgetComparisonReportService.downloadBudgetComparisonExcel(scenarioIdPair).then((res) => {
          var url = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/vnd.ms-excel' })
          );
          var a = window.document.createElement('a'); // eslint-disable-line angular/document-service
          a.href = url;
          let workgroupName = JSON.parse(localStorage.getItem('workgroup')).name;
          let academicYear = (parseInt(localStorage.year) - 1).toString().yearToAcademicYear();
          a.download = `Budget-Comparison-Report-${workgroupName}-${academicYear}.xlsx`;
          window.document.body.appendChild(a); // eslint-disable-line angular/document-service
          a.click();
          a.remove(); //afterwards we remove the element again
        });
      }
    };
  }
}

BudgetComparisonReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'validate', 'AuthService', 'BudgetComparisonReportActions', 'BudgetComparisonReportService'];

export default BudgetComparisonReportCtrl;
