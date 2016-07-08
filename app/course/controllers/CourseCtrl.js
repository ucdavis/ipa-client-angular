'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
courseApp.controller('CourseCtrl', ['$scope', '$rootScope', '$routeParams',
		this.CourseCtrl = function ($scope, $rootScope, $routeParams) {
			$scope.courseCode = $routeParams.courseCode;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('courseStateChanged', function (event, data) {
				$scope.view.state = data;

				window.data = data;

				CourseTable.render(data);
			});

			CourseTable.registerEvents();
	}]);

CourseCtrl.getPayload = function (authService, $route, courseActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.courseCode, $route.current.params.year).then(function () {
		return courseActionCreators.getInitialState($route.current.params.courseCode, $route.current.params.year);
	});
}