'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupsCtrl
 * @description
 * # WorkgroupsCtrl
 * Controller of the ipaClientAngularApp
 */
summaryApp.controller('WorkgroupsCtrl', ['$scope',
		this.WorkgroupsCtrl = function ($scope) {
			console.log('Workgroup Controller says hi');
}]);

// TODO: This should be removed when authenticate is moved to shared service
WorkgroupsCtrl.authenticate = function (authService) {
	//return authService.validate(localStorage.getItem('JWT'));
}