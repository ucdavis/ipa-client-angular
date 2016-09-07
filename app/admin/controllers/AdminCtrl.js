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

			$rootScope.$on('adminStateChanged', function (event, data) {
				$scope.view.state = data.state;
				console.log(data.state);
			});

		}
]);

AdminCtrl.getPayload = function (authService, $route, adminActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return adminActionCreators.getInitialState();
	});
}
