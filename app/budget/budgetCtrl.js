budgetApp.controller('BudgetCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', '$timeout',
	this.BudgetCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $timeout) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('budgetStateChanged', function (event, data) {
			$scope.view.state = data;

			// Set the current active budget scenario id
			if ($scope.view.state.selectedBudgetScenario) {
				localStorage.setItem('selectedBudgetScenarioId', $scope.view.state.selectedBudgetScenario.id);
			} else {
				localStorage.removeItem('selectedBudgetScenarioId');
			}
			// Set the current selected term
			if ($scope.view.state.selectedBudgetScenario) {
				localStorage.setItem('selectedTerm', $scope.view.state.selectedBudgetScenario.selectedTerm);
			} else {
				localStorage.removeItem('selectedTerm');
			}
		});

		$scope.openLineItemModal = function() {
			$scope.view.state.openAddLineItem = true;
		};

		$scope.openSupportCostModal = function() {
			$scope.view.state.openSupportCosts = true;
		};

		$scope.openBudgetScenarioModal = function() {
			$scope.view.state.openAddBudgetScenario = true;
		};
}]);

BudgetCtrl.getPayload = function (authService, $route, $window, budgetActions) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		budgetActions.getInitialState(
			$route.current.params.workgroupId,
			$route.current.params.year,
			localStorage.getItem('selectedBudgetScenarioId'),
			localStorage.getItem('selectedTerm'));
	});

};