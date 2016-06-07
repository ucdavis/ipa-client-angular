'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope',
		this.SummaryCtrl = function ($scope) {
			console.log('Summary Controller');
			$scope.year = "2020";
			$scope.termCode = "10";
			$scope.workgroupCode = "PSC";
}]);

SummaryCtrl.authenticate = function (authService) {
	return authService.validate(localStorage.getItem('JWT'));
}
