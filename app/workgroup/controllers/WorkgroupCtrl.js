'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupCtrl
 * @description
 * # WorkgroupCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('WorkgroupCtrl', ['$scope', '$rootScope', '$routeParams', 'workgroupStateService', 'workgroupActionCreators',
		this.WorkgroupCtrl = function ($scope, $rootScope, $routeParams, workgroupStateService, workgroupActionCreators) {
			$scope.workgroupCode = $routeParams.workgroupCode;
			$scope.year = $routeParams.year;

			$scope.view = {};
			console.log('Workgroup Controller says hi');

			$scope.view.state = workgroupStateService.getState();
			$rootScope.$on('workgroupStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$scope.addTag = function () {
				workgroupActionCreators.addTag({
					id: 4,
					name: "UCD Course"
				});
			}

			workgroupActionCreators.getInitialState($scope.workgroupCode);
}]);

WorkgroupCtrl.authenticate = function (authService) {
	return authService.validate(localStorage.getItem('JWT'));
}