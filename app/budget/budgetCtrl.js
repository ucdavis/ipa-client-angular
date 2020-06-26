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
    this.AuthService = AuthService;
    var _self = this;

    $scope.noAccess = validate ? validate.noAccess : null;
    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;

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

    _self.$scope.helloButton = function helloButton (){
      console.log('Hello');
      const headers = new Headers();
      headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZG5wZXJleiIsImxvZ2luSWQiOiJlZG5wZXJleiIsInJlYWxVc2VyTG9naW5JZCI6ImVkbnBlcmV6IiwiZXhwaXJhdGlvbkRhdGUiOjE1OTMwNDEyMDcyNDMsImlhdCI6MTU5MzAzNzYwN30.rJ3Biu693OdBD-IRfeteWWUGQEi3y2OsWyinH_lN0mo');
      headers.append('Cookie', 'JSESSIONID=71B825CEA9A9A84D77CA4078F9B405EF');
      var resp = fetch('http://localhost:8080/api/budgetView/helloworld2', {'method': 'POST', 'headers': headers}).then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = window.document.createElement('a');
            a.href = url;
            a.download = "filename.xls";
            window.document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        });
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
  "AuthService",
  "validate"
];

export default BudgetCtrl;
