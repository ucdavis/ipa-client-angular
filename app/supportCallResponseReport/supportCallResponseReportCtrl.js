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
    $scope.filters = [];
    $scope.view = {};

    $rootScope.$on('reportStateChanged', function (event, data) {
      _self.$scope.view.state = data.state;

      _self.$scope.view.hasAccess =
        _self.$scope.sharedState.currentUser.isAdmin() ||
        _self.$scope.sharedState.currentUser.hasRole(
          'academicPlanner',
          _self.$scope.sharedState.workgroup.id
        );

        _self.$scope.filters = Object.keys(_self.$scope.view.state.ui).map(key => (
          {
            key,
            description: key.slice(4).split(/(?=[A-Z])/).join(" "),
            selected: _self.$scope.view.state.ui[key]
          }
        ));

        const currentSupportStaffIds = new Set(_self.$scope.view.state.supportCallResponses.map(response => response.supportStaffId));
        const currentSupportStaff = _self.$scope.view.state.supportStaff.filter(supportStaff => currentSupportStaffIds.has(supportStaff.id));
        if (_self.$scope.view.state.ui.showSubmitted === true) {
          _self.$scope.filteredSupportStaff = currentSupportStaff.filter(staff => {
            return staff.preferences.length > 0;
          });
        } else {
          _self.$scope.filteredSupportStaff = currentSupportStaff;
        }
    });

    $scope.sharedState = $scope.sharedState || AuthService.getSharedState();

    $scope.toggleFilter = function (filter) {
      SupportCallResponseReportActionCreators.toggleFilter(filter);
    };

    $scope.getLanguageProficiencyDescription = function (langaugeProficiency) {
      return SupportCallService.getLanguageProficiencyDescription(langaugeProficiency);
    };

    $scope.getShortTermName = function (termShortCode) {
      return TermService.getShortTermName(termShortCode);
    };

    $scope.download = function (singleTerm) {
      if (singleTerm) {
        SupportCallResponseReportService.download(
          $scope.workgroupId,
          $scope.year,
          $scope.termShortCode
        );
      } else {
        SupportCallResponseReportService.download(
          $scope.workgroupId,
          $scope.year,
        );
      }
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
