'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupCtrl
 * @description
 * # WorkgroupCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('WorkgroupCtrl', ['$scope', '$rootScope', '$routeParams', '$location',
		this.WorkgroupCtrl = function ($scope, $rootScope, $routeParams, $location) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('workgroupStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$scope.setActiveTab = function (tabName) {
				$scope.activeWorkgroupTab = tabName;
				$location.search({ tab: tabName });
			};

			if ($routeParams.tab) {
				// Set the active tab according to the URL
				$scope.activeWorkgroupTab = $routeParams.tab;
			} else {
				// Otherwise redirect to the default view
				$scope.setActiveTab('tags');
			}
	}]);

WorkgroupCtrl.getPayload = function (authService,workgroupActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return workgroupActionCreators.getInitialState($route.current.params.workgroupId);
	});
}