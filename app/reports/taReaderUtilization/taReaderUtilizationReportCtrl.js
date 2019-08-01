import "./taReaderUtilizationReport.css";

class TaReaderUtilizationReportCtrl {
  constructor(
    $scope,
    $rootScope,
    $routeParams,
    validate,
    AuthService,
    TaReaderUtilizationReportActions
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;

    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;
    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.view = {};

    $rootScope.$on("TaReaderUtilizationReportStateChanged", function(event, data) {
      $scope.view.state = data.state;
    });

    $scope.downloadAsExcel = function() {
      TaReaderUtilizationReportActions.downloadAsExcel(
        $scope.year,
        $scope.sharedState.workgroup.name
      );
    };
  }
}

TaReaderUtilizationReportCtrl.$inject = [
  "$scope",
  "$rootScope",
  "$routeParams",
  "validate",
  "AuthService",
  "TaReaderUtilizationReportActions"
];

export default TaReaderUtilizationReportCtrl;
