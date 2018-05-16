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
		var here = this;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$scope.budgetConfigStyles = { "width" : "40%" };

		this.getPayload().then( function() {
			here.initialize();
		});
	}

	initialize () {
		var here = this;

		this.$scope.currentUser = here.AuthService.getCurrentUser();

		this.$rootScope.$on('budgetStateChanged', function (event, data) {
			here.$scope.view.state = data;

			// Set the current active budget scenario id
			if (here.$scope.view.state.selectedBudgetScenario) {
				localStorage.setItem('selectedBudgetScenarioId', here.$scope.view.state.selectedBudgetScenario.id);
			} else {
				localStorage.removeItem('selectedBudgetScenarioId');
			}
			// Set the current selected term
			if (here.$scope.view.state.selectedBudgetScenario) {
				localStorage.setItem('selectedTerm', here.$scope.view.state.selectedBudgetScenario.selectedTerm);
			} else {
				localStorage.removeItem('selectedTerm');
			}
		});
	}

	getPayload () {
		var self = this;
	return self.AuthService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			var selectedBudgetScenarioId = parseInt(localStorage.getItem('selectedBudgetScenarioId')) || null;

			if (self.$route.current.params.workgroupId && self.$route.current.params.year) {
				self.BudgetActions.getInitialState(
					self.$route.current.params.workgroupId,
					self.$route.current.params.year,
					selectedBudgetScenarioId,
					localStorage.getItem('selectedTerm'));
			}
		});
	
	}
}

BudgetCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$timeout', 'BudgetActions', 'AuthService'];

export default BudgetCtrl;
