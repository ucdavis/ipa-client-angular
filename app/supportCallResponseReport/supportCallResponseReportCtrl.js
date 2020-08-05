class SupportCallResponseReportCtrl {
  constructor(
    $scope,
    $rootScope,
    $route,
    $routeParams,
    SupportCallResponseReportActionCreators,
    AuthService,
    SupportCallResponseReportService,
    SupportCallService,
    TermService,
    validate
  ) {
    var _self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$route = $route;
    this.$routeParams = $routeParams;
    this.supportCallResponseReportActionCreators = SupportCallResponseReportActionCreators;
    this.authService = AuthService;
    this.supportCallResponseReportService = SupportCallResponseReportService;
    this.TermService = TermService;

    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.workgroupId = this.$routeParams.workgroupId;
    $scope.year = this.$routeParams.year;
    $scope.termShortCode = $routeParams.termShortCode;
    $scope.termCode = TermService.termToTermCode($scope.termShortCode, $scope.year);
    $scope.view = {};

    $rootScope.$on('reportStateChanged', function (event, data) {
      _self.$scope.view.state = data.state;
      console.log(data.state); // TODO: DELETE ME

      _self.$scope.view.hasAccess =
        _self.$scope.sharedState.currentUser.isAdmin() ||
        _self.$scope.sharedState.currentUser.hasRole(
          'academicPlanner',
          _self.$scope.sharedState.workgroup.id
        );
    });

    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.getLanguageProficiencyDescription = function (langaugeProficiency) {
      return SupportCallService.getLanguageProficiencyDescription(langaugeProficiency);
    };

    $scope.getTermName = function (term) {
      return TermService.getTermName(term);
    };

    $scope.download = function () {
      SupportCallResponseReportService.download(
        $scope.workgroupId,
        $scope.year,
        $scope.termShortCode
      );
    };
  }
}

SupportCallResponseReportCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$route',
  '$routeParams',
  'SupportCallResponseReportActionCreators',
  'AuthService',
  'SupportCallResponseReportService',
  'SupportCallService',
  'TermService',
  'validate',
];

export default SupportCallResponseReportCtrl;
