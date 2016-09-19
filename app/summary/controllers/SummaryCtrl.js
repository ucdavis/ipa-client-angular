'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$http',
		this.SummaryCtrl = function ($scope, $routeParams, $http) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
}]);

SummaryCtrl.authenticate = function (authService, $route, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}
