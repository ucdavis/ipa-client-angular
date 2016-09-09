'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupCtrl
 * @description
 * # WorkgroupCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('WorkgroupCtrl', ['$scope', '$rootScope', '$routeParams', 'workgroupActionCreators', 'authService',
		this.WorkgroupCtrl = function ($scope, $rootScope, $routeParams, workgroupActionCreators, authService) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('workgroupStateChanged', function (event, data) {
				$scope.view.state = data;
			});
	}]);

WorkgroupCtrl.getPayload = function (authService,workgroupActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return workgroupActionCreators.getInitialState($route.current.params.workgroupId);
	});
}