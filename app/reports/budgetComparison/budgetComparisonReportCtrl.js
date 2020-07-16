import './budgetComparisonReport.css';

class BudgetComparisonReportCtrl {
  constructor ($scope, $rootScope, $routeParams, validate, AuthService, ApiService, BudgetComparisonReportActions) {
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

    $scope.downloadAsExcel = function() {
      BudgetComparisonReportActions.downloadAsExcel($scope.year, $scope.sharedState.workgroup.name);
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

    $scope.downloadMultiple = function() {
      let scenarioPairs = [
        [{ id: 303 }, { id: 652 }],
        [{ id: 259 }, { id: 56 }]
      ];

      ApiService.postWithResponseType("/api/budgetView/downloadBudgetComparisonExcel", scenarioPairs, '', 'arraybuffer').then((response) => {
        var url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/vnd.ms-excel' })
        );
        var a = window.document.createElement('a'); // eslint-disable-line
        a.href = url;
        a.download = 'Budget Report Download.xlsx';
        window.document.body.appendChild(a); // eslint-disable-line
        a.click();
        a.remove(); //afterwards we remove the element again
      });
    };
  }
}

BudgetComparisonReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'validate', 'AuthService', 'ApiService', 'BudgetComparisonReportActions'];

export default BudgetComparisonReportCtrl;
