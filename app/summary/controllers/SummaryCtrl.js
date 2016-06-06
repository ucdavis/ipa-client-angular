'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope','sharedStateService',
		this.SummaryCtrl = function ($scope, sharedStateService) {
			console.log('Summary Controller');
}]);

SummaryCtrl.authenticate = function (authService) {
	return authService.validate(localStorage.getItem('JWT'));
}

SummaryCtrl.setParams = function ($route, sharedStateService) {
	sharedStateService.setYear($route.current.params.year);
	sharedStateService.setWorkgroupCode($route.current.params.workgroupCode);
}
