'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
courseApp.controller('CourseCtrl', ['$scope', '$rootScope', '$routeParams', 'courseActionCreators', 'courseService',
		this.CourseCtrl = function ($scope, $rootScope, $routeParams, courseActionCreators, courseService) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('courseStateChanged', function (event, data) {
				$scope.view.state = data.state;

				if (data.state.courses.newCourse) {
					// A new course is being created
					$scope.view.selectedEntity = $scope.view.state.courses.newCourse;
					$scope.view.selectedEntityType = "course";
				} else if (data.state.uiState.selectedCourseId && !data.state.uiState.selectedTermCode) {
					// A course is selected
					$scope.view.selectedEntity = $scope.view.state.courses.list[data.state.uiState.selectedCourseId];
					$scope.view.selectedEntityType = "course";
				} else if (data.state.uiState.selectedCourseId && data.state.uiState.selectedTermCode) {
					// A sectionGroup is selected
					var course = $scope.view.state.courses.list[data.state.uiState.selectedCourseId];
					$scope.view.selectedEntity = _.find($scope.view.state.sectionGroups.list, function(sg) { return (sg.termCode == data.state.uiState.selectedTermCode) && (sg.courseId == data.state.uiState.selectedCourseId) });
					$scope.view.selectedEntityType = "sectionGroup";
				} else {
					delete $scope.view.selectedEntity;
				}
			});

			$scope.closeDetails = function () {
				courseActionCreators.closeDetails();
				delete $scope.view.selectedEntity;
			};

			$scope.termToggled = function (id) {
				courseActionCreators.toggleTermFilter(id);
			};

			$scope.createCourse = function () {
				courseActionCreators.createCourse($scope.view.state.courses.newCourse, $scope.workgroupId, $scope.year);
			};

			$scope.searchCourses = function (query) {
				return courseService.searchCourses(query).then(function (courseSearchResults) {
					return courseSearchResults.slice(0, 20);
				}, function (err) {
					$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
				});
			};

			$scope.searchCoursesResultSelected = function ($item, $model, $label, $event) {
				$scope.view.state.courses.newCourse.title = $item.title;
				$scope.view.state.courses.newCourse.subjectCode = $item.subjectCode;
				$scope.view.state.courses.newCourse.courseNumber = $item.courseNumber;
				$scope.view.state.courses.newCourse.effectiveTermCode = $item.effectiveTermCode;
			};
		}
]);

CourseCtrl.getPayload = function (authService, $route, courseActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return courseActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
}