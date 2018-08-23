class BudgetCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $timeout, BudgetActions, AuthService) {
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

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$scope.budgetConfigStyles = { "width" : "40%" };

		_self.initialize();
	}

	initialize () {
		var _self = this;

		this.$scope.currentUser = _self.AuthService.getCurrentUser();

		this.$rootScope.$on('budgetStateChanged', function (event, data) {
			_self.$scope.view.state = data;

			// Set the current active budget scenario id
			if (_self.$scope.view.state.selectedBudgetScenario) {
				localStorage.setItem('selectedBudgetScenarioId', _self.$scope.view.state.selectedBudgetScenario.id);
			} else {
				localStorage.removeItem('selectedBudgetScenarioId');
			}
			// Set the current selected term
			if (_self.$scope.view.state.selectedBudgetScenario) {
				localStorage.setItem('selectedTerm', _self.$scope.view.state.selectedBudgetScenario.selectedTerm);
			} else {
				localStorage.removeItem('selectedTerm');
			}
		});
	}
}

BudgetCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$timeout', 'BudgetActions', 'AuthService'];

export default BudgetCtrl;
