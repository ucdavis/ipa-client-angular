/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
budgetApp.controller('BudgetCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', '$timeout',
		this.BudgetCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $timeout) {
			console.log("I am the budget controller");
	}]);

BudgetCtrl.getPayload = function ($route, $window) {
	console.log("I am the budget payload");
	return null;
};