'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('AssignmentCtrl', ['$scope', '$rootScope', '$routeParams',
		this.AssignmentCtrl = function ($scope, $rootScope, $routeParams) {
			$scope.workgroupCode = $routeParams.workgroupCode;
			$scope.year = $routeParams.year;
			$scope.view = {};

			console.log("AssignmentCtrl hello");
			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log("assignmentStateChanged");
				console.log($scope.view.state);
			});
	}]);
AssignmentCtrl.validate = function () {
	console.log("triggering validate");

	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year);
}