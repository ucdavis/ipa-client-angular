'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the ipaClientAngularApp
 */
adminApp.controller('AdminCtrl', ['$scope', '$rootScope', '$routeParams',
		this.AdminCtrl = function ($scope, $rootScope, $routeParams) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};
		}
]);

AdminCtrl.getPayload = function (authService, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year);
}
