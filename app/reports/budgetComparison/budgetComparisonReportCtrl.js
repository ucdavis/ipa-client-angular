import './budgetComparisonReport.css';

class BudgetComparisonReportCtrl {
  constructor ($scope, $rootScope, $routeParams, validate, AuthService, BudgetComparisonReportActions) {
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

    $scope.updateFilter = function(filter) {
      filter.selected = !filter.selected;

      $scope.activeFilters = $scope.view.state.ui.filters.filter(function(filter) {
        return filter.selected;
      });

      BudgetComparisonReportActions.updateFilter(filter);
    };

    $scope.removeFilter = function(filter) {
        let selectedFilter = $scope.view.state.ui.filters.find(function(slotFilter) {
          return slotFilter.description == filter.description;
        });

        selectedFilter.selected = !selectedFilter.selected;

        $scope.activeFilters = $scope.view.state.ui.filters.filter(function(filter) {
          return filter.selected;
        });

        BudgetComparisonReportActions.updateFilter(selectedFilter);
    };
  }
}

BudgetComparisonReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'validate', 'AuthService', 'BudgetComparisonReportActions'];

export default BudgetComparisonReportCtrl;
