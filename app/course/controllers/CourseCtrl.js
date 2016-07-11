'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
courseApp.controller('CourseCtrl', ['$scope', '$rootScope', '$routeParams', 'courseActionCreators',
		this.CourseCtrl = function ($scope, $rootScope, $routeParams, courseActionCreators) {
			$scope.courseCode = $routeParams.courseCode;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('courseStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$rootScope.$on('cellChanged', function (event, data) {
				if (data.courseId && !data.termCode) {
					// A course is selected
					$scope.view.selectedEntity = $scope.view.state.courses.list[data.courseId];
				} else if (data.courseId && data.termCode) {
					// A sectionGroup is selected
					var course = $scope.view.state.courses.list[data.courseId];
					$scope.view.selectedEntity = $scope.view.state.sectionGroups.list[course.sectionGroupTermCodeIds[data.termCode]];
				}
			});

			$scope.closeDetails = function () {
				courseActionCreators.setActiveCell();
				delete $scope.view.selectedEntity;
			}
	}]);

CourseCtrl.getPayload = function (authService, $route, courseActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.courseCode, $route.current.params.year).then(function () {
		return courseActionCreators.getInitialState($route.current.params.courseCode, $route.current.params.year);
	});
}