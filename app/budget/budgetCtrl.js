/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
budgetApp.controller('BudgetCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', '$timeout',
	this.BudgetCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $timeout) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('budgetStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.openBudgetScenarioModal = function() {
			$scope.view.state.openAddBudgetScenario = true;
		};
		$scope.closeBudgetScenarioModal = function() {
			$scope.view.state.openAddBudgetScenario = false;
		};
}]);

BudgetCtrl.getPayload = function (authService, $route, $window, budgetActions) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		budgetActions.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});

};