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
				if (data.view.selectedCourseId && !data.view.selectedTermCode) {
					// A course is selected
					$scope.view.selectedEntity = data.courses.list[data.view.selectedCourseId];
				} else if (data.view.selectedCourseId && data.view.selectedTermCode) {
					// A sectionGroup is selected
					var course = data.courses.list[data.view.selectedCourseId];
					$scope.view.selectedEntity = data.sectionGroups.list[course.sectionGroupTermCodeIds[data.view.selectedTermCode]];
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