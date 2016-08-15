'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams',
		this.SummaryCtrl = function ($scope, $routeParams) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
}]);

SummaryCtrl.authenticate = function (authService, $route) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year);
}
