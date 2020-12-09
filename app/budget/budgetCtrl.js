class BudgetCtrl {
  constructor(
    $scope,
    $rootScope,
    $window,
    $location,
    $route,
    $routeParams,
    $timeout,
    BudgetActions,
    BudgetService,
    AuthService,
    validate
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$location = $location;
    this.$route = $route;
    this.$routeParams = $routeParams;
    this.$timeout = $timeout;
    this.BudgetActions = BudgetActions;
    this.BudgetService = BudgetService;
    this.AuthService = AuthService;
    var _self = this;

    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;
    $scope.isActivityLogOpen = false;

    $scope.view = {};

    $scope.budgetConfigStyles = { width: "40%" };

    _self.initialize();
  }

  initialize() {
    var _self = this;

    this.$scope.currentUser = _self.AuthService.getCurrentUser();

    this.$rootScope.$on("budgetStateChanged", function(event, data) {
      _self.$scope.view.state = data;

      // Set the active tab
      if (_self.$scope.view.state.ui.sectionNav) {
        localStorage.setItem('activeTab', _self.$scope.view.state.ui.sectionNav.activeTab);
      } else {
        localStorage.removeItem("activeTab");
      }

      // Set the current active budget scenario id
      if (_self.$scope.view.state.selectedBudgetScenario) {
        localStorage.setItem(
          "selectedBudgetScenarioId",
          _self.$scope.view.state.selectedBudgetScenario.id
        );
      } else {
        localStorage.removeItem("selectedBudgetScenarioId");
      }
      // Set the current selected term
      if (_self.$scope.view.state.selectedBudgetScenario) {
        localStorage.setItem(
          "selectedTerm",
          _self.$scope.view.state.selectedBudgetScenario.selectedTerm
        );
      } else {
        localStorage.removeItem("selectedTerm");
      }
    });

    this.$scope.toggleActivityLogOpen = function() {
      _self.BudgetService.getAuditLogs(_self.$scope.workgroupId, _self.$scope.year).then(res => {
        _self.$scope.auditLogs = res;
      });

      return _self.$scope.isActivityLogOpen = !_self.$scope.isActivityLogOpen;
    };
  }
}

BudgetCtrl.$inject = [
  "$scope",
  "$rootScope",
  "$window",
  "$location",
  "$route",
  "$routeParams",
  "$timeout",
  "BudgetActions",
  "BudgetService",
  "AuthService",
  "validate"
];

export default BudgetCtrl;
