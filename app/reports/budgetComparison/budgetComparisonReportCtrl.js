import './budgetComparisonReport.css';

class BudgetComparisonReportCtrl {
  constructor ($scope, $rootScope, $routeParams, validate, AuthService) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;

    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;
    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.view = {};

    $rootScope.$on('budgetComparisonReportStateChanged', function (event, data) {
      $scope.view.state = data.state;
    });
  }
}

BudgetComparisonReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'validate', 'AuthService'];

export default BudgetComparisonReportCtrl;
