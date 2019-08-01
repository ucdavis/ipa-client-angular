import "./supportUtilizationReport.css";

class SupportUtilizationReportCtrl {
  constructor(
    $scope,
    $rootScope,
    $routeParams,
    validate,
    AuthService,
    SupportUtilizationReportActions
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;

    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;
    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.view = {};

    $rootScope.$on("SupportUtilizationReportStateChanged", function(event, data) {
      $scope.view.state = data.state;
    });

    $scope.downloadAsExcel = function() {
      SupportUtilizationReportActions.downloadAsExcel(
        $scope.year,
        $scope.sharedState.workgroup.name
      );
    };
  }
}

SupportUtilizationReportCtrl.$inject = [
  "$scope",
  "$rootScope",
  "$routeParams",
  "validate",
  "AuthService",
  "SupportUtilizationReportActions"
];

export default SupportUtilizationReportCtrl;
