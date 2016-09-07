'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$rootScope',
		this.SummaryCtrl = function ($scope, $routeParams, $rootScope) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('summaryStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});

			$rootScope.$on('sharedStateSet', function (event, data) {
				$scope.sharedState = data;

				if ($scope.sharedState.activeWorkgroup.roles.indexOf("senateInstructor") || $scope.sharedState.activeWorkgroup.roles.indexOf("federationInstructor")) {
					$scope.sharedState.isInstructor = true;
				}

				if ($scope.sharedState.activeWorkgroup.roles.indexOf("academicPlanner") ) {
					$scope.sharedState.isAcademicPlanner = true;
				}
			});
}]);

SummaryCtrl.authenticate = function (authService, $route, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}
