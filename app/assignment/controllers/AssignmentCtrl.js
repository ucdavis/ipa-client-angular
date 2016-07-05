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

			$rootScope.$on('workgroupStateChanged', function (event, data) {
				$scope.view.state = data;
			});
	}]);