'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupsCtrl
 * @description
 * # WorkgroupsCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupsApp.controller('WorkgroupsCtrl', ['$scope', '$rootScope', 'workgroupsStateService', 'workgroupsActionCreators',
		this.WorkgroupsCtrl = function ($scope, $rootScope, workgroupsStateService, workgroupsActionCreators) {
			$scope.view = {};
			console.log('Workgroup Controller says hi');

			$scope.view.state = workgroupsStateService.getState();
			$rootScope.$on('workgroupsStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$scope.addTag = function () {
				workgroupsActionCreators.addTag({
					id: 4,
					name: "UCD Course"
				});
			}
}]);

// TODO: This should be removed when authenticate is moved to shared service
WorkgroupsCtrl.authenticate = function (authService) {
	//return authService.validate(localStorage.getItem('JWT'));
}