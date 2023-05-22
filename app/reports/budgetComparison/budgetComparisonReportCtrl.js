import './budgetComparisonReport.css';

class BudgetComparisonReportCtrl {
  constructor ($scope, $rootScope, $routeParams, validate, AuthService, BudgetComparisonReportActions, BudgetComparisonReportService) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;

    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = localStorage.getItem("budgetComparisonCurrentYear") || $routeParams.year;
    $scope.previousYear = localStorage.getItem("budgetComparisonPreviousYear") || $scope.year - 1 ;
    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.view = {};
    $scope.activeFilters = [];

    $scope.years = [
      {id: 0, description: '2020', selected: false},
      {id: 1, description: '2021', selected: false},
      {id: 2, description: '2022', selected: false},
      {id: 3, description: '2023', selected: false}
  ];

    $rootScope.$on('budgetComparisonReportStateChanged', function (event, data) {
      $scope.view.state = data.state;
    });

    $scope.changePreviousYear = function(year) {
      // override the year?
      $scope.previousYear = year.description;
      localStorage.setItem("budgetComparisonPreviousYear", year.description);
      BudgetComparisonReportActions.getInitialState();
    };

    $scope.changeCurrentYear = function(year) {
      $scope.currentYear = year.description;
      localStorage.setItem("budgetComparisonCurrentYear", year.description);
      BudgetComparisonReportActions.getInitialState();
    };

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
