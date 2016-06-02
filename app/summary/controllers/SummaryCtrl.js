'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ipaClientAngularApp
 */
summaryApp.controller('SummaryCtrl', ['$scope',
		this.SummaryCtrl = function ($scope) {
			console.log('Summary Controller');

}]);

SummaryCtrl.authenticate = function (authService) {
	return authService.validate(localStorage.getItem('JWT'));
}