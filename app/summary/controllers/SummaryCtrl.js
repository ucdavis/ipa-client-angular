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
			$scope.workgroupCode = $routeParams.workgroupCode;
			$scope.year = $routeParams.year;
}]);

SummaryCtrl.authenticate = function (authService, $route) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupCode, $route.current.params.year);
}
