'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('AssignmentCtrl', ['$scope', '$rootScope', '$routeParams', 'assignmentActionCreators',
		this.AssignmentCtrl = function ($scope, $rootScope, $routeParams, assignmentActionCreators) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});

			$scope.showInstructors = function () {
				assignmentActionCreators.showInstructors();
			}

			$scope.showCourses = function () {
				assignmentActionCreators.showCourses();
			};

			$scope.approveInstructorAssignment = function(teachingAssignmentId) {
				console.log("clicked");
				var teachingAssignment = $scope.view.state.teachingAssignments.list[teachingAssignmentId];
				assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
			};

			$scope.unapproveInstructorAssignment = function(teachingAssignmentId) {
				var teachingAssignment = $scope.view.state.teachingAssignments.list[teachingAssignmentId];
				assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
			};
	}]);

AssignmentCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}