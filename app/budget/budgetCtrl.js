/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
budgetApp.controller('BudgetCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', '$timeout',
	this.BudgetCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $timeout) {
		$scope.view = {};
		$scope.view.state = {};

		$scope.openBudgetScenarioModal = function() {
			$scope.view.state.openAddBudgetScenario = true;
		};
		$scope.closeBudgetScenarioModal = function() {
			$scope.view.state.openAddBudgetScenario = false;
		};

}]);

BudgetCtrl.getPayload = function ($route, $window) {
	budgetActions.getInitialState($route.current.params.workgroupId, $route.current.params.year);
};