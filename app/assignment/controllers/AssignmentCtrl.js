'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('AssignmentCtrl', ['$scope', '$rootScope', '$routeParams', '$uibModal', 'assignmentActionCreators', 'assignmentService',
		this.AssignmentCtrl = function ($scope, $rootScope, $routeParams, $uibModal, assignmentActionCreators, assignmentService) {
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

			$scope.termToggled = function(id) {
				assignmentActionCreators.toggleTermFilter(id);
			}

			$scope.approveInstructorAssignment = function(teachingAssignmentId) {
				var teachingAssignment = $scope.view.state.teachingAssignments.list[teachingAssignmentId];
				assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
			};

			$scope.unapproveInstructorAssignment = function(teachingAssignmentId) {
				var teachingAssignment = $scope.view.state.teachingAssignments.list[teachingAssignmentId];
				assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
			};

			$scope.addAndApproveInstructorAssignment = function(sectionGroupId, instructorId, termCode) {
				var teachingAssignment = {
					sectionGroupId: sectionGroupId,
					instructorId: instructorId,
					termCode: termCode,
					priority: 1,
					approved: true
				}

				assignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment);
			};

			// Launches TeachingCall Config modal and controller
			$scope.openTeachingCallConfig = function() {
				modalInstance = $uibModal.open({
					templateUrl: 'ModalTeachingCallConfig.html',
					controller: ModalTeachingCallConfigCtrl,
					size: 'lg',
					resolve: {
						scheduleYear: function () {
							return $scope.year;
						},
						workgroupId: function () {
							return $scope.workgroupId;
						},
						viewState: function () {
							return $scope.view.state;
						},
						allTerms: function () {
							return assignmentService.allTerms();
						}
					}
				});

				modalInstance.result.then(function (teachingCallConfig) {
					$scope.startTeachingCall(schedule, teachingCallConfig);
				});
			};

			// Triggered on TeachingCall Config submission
			$scope.startTeachingCall = function(schedule, teachingCallConfig) {
				teachingCallConfig.termsBlob = "";
				var terms = termService.getAllTerms();

				for (var i = 0; i < terms.length; i++) {
					if (teachingCallConfig.activeTerms[terms[i]] == true) {
						teachingCallConfig.termsBlob += "1";
					} else {
						teachingCallConfig.termsBlob += "0";
					}
				}

				delete teachingCallConfig.activeTerms;

				// TODO: refactor into actionCreator
				teachingCallService.createTeachingCall(schedule.id, teachingCallConfig).then(function(tachingCall) {
					$scope.updateSchedules();
					schedule.teachingCalls.push(tachingCall);
					$scope.calculateTeachingCallEligibility();
				}, function() {
				});
			};
	}]);

AssignmentCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}