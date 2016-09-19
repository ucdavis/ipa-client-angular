'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the ipaClientAngularApp
 */
adminApp.controller('AdminCtrl', ['$scope', '$rootScope', '$routeParams', 'adminActionCreators', 'authService',
		this.AdminCtrl = function ($scope, $rootScope, $routeParams, adminActionCreators, authService) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year || moment().year();
			$scope.view = {};

			$rootScope.$on('adminStateChanged', function (event, data) {
				$scope.view.state = data.state;
			});

			$scope.updateWorkgroup = function (workgroup) {
				adminActionCreators.updateWorkgroup(workgroup);
			};

			$scope.removeWorkgroup = function (workgroup) {
				adminActionCreators.removeWorkgroup(workgroup);
			};

			$scope.addWorkgroup = function () {
				adminActionCreators.addWorkgroup($scope.view.state.workgroups.newWorkgroup);
			};

			$scope.setActiveWorkgroup = function (workgroupId, year) {
				authService.setSharedState($scope.view.state.workgroups.list[workgroupId], year);
			};
		}
]);

AdminCtrl.getPayload = function (authService, $route, adminActionCreators) {
	var ignoreFallBackUrl = true;
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year, ignoreFallBackUrl).then(function () {
		return adminActionCreators.getInitialState();
	});
}
