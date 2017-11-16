/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('AssignmentCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'assignmentActionCreators', 'assignmentService',
		this.AssignmentCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, assignmentActionCreators, assignmentService) {
			$window.document.title = "Assignments";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$scope.showInstructors = function () {
				assignmentActionCreators.showInstructors();
			};

			$scope.showCourses = function () {
				assignmentActionCreators.showCourses();
			};

			$scope.termToggled = function (id) {
				assignmentActionCreators.toggleTermFilter(id);
			};

			$scope.toggleDisplayCompletedInstructors = function () {
				assignmentActionCreators.toggleDisplayCompletedInstructors(!$scope.view.state.filters.showCompletedInstructors);
			};

			$scope.approveInstructorAssignment = function (teachingAssignmentId) {
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
				};

				assignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment);
			};

			// Triggered by global search field, redraws table based on query
			$scope.filterTable = function (query) {
				clearTimeout($scope.t);
				$scope.t = setTimeout($scope.startFilter, 700, query);
			};

			$scope.startFilter = function (query) {
				assignmentActionCreators.updateTableFilter(query);
			};

			$scope.toggleTag = function (tagId) {
				var tagFilters = $scope.view.state.filters.enabledTagIds;
				var tagIndex = tagFilters.indexOf(tagId);

				if (tagIndex < 0) {
					tagFilters.push(tagId);
				} else {
					tagFilters.splice(tagIndex, 1);
				}

				assignmentActionCreators.updateTagFilters(tagFilters);
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
					$scope.startTeachingCall($scope.workgroupId, $scope.year, teachingCallConfig);
				});
			};

			// Triggered on TeachingCall Config submission
			$scope.startTeachingCall = function(workgroupId, year, teachingCallConfig) {
				teachingCallConfig.termsBlob = "";
				var allTerms = ['05','06','07','08','09','10','01','02','03'];

				for (var i = 0; i < allTerms.length; i++) {
					if (teachingCallConfig.activeTerms[allTerms[i]] === true) {
						teachingCallConfig.termsBlob += "1";
					} else {
						teachingCallConfig.termsBlob += "0";
					}
				}

				delete teachingCallConfig.activeTerms;

				assignmentActionCreators.createTeachingCall(workgroupId, year, teachingCallConfig);
			};

			// Launched from the instructorTable directive UI handler
			$scope.openCommentModal = function(instructorId) {
				var instructor = $scope.view.state.instructors.list[instructorId];
				var scheduleInstructorNote = {};

				// Create new scheduleInstructorNote object if one does not already exist
				if (instructor.scheduleInstructorNoteId) {
					scheduleInstructorNote = $scope.view.state.scheduleInstructorNotes.list[instructor.scheduleInstructorNoteId];
				} else {
					scheduleInstructorNote = {};
					scheduleInstructorNote.instructorComment = "";
				}

				// Find a teachingCallReceipt for this instructor and schedule, if one exists.
				var teachingCallReceipt = null;

				for (var i = 0; i < $scope.view.state.teachingCallReceipts.ids.length; i++) {
					teachingCallReceipt = $scope.view.state.teachingCallReceipts.list[$scope.view.state.teachingCallReceipts.ids[i]];

					if (teachingCallReceipt.instructorId == instructor.id) {
						break;
					}
				}

				modalInstance = $uibModal.open({
					templateUrl: 'ModalComment.html',
					controller: ModalCommentCtrl,
					size: 'lg',
					resolve: {
						instructor: function () {
							return instructor;
						},
						privateComment: function () {
							return scheduleInstructorNote.instructorComment;
						},
						instructorComment: function () {
							if (teachingCallReceipt && teachingCallReceipt.comment) {
								return teachingCallReceipt.comment;
							} else {
								return "";
							}
						}
					}
				});

				modalInstance.result.then(function (privateComment) {
					if (privateComment != scheduleInstructorNote.comment) {
						// Update the scheduleInstructorNote
						if (scheduleInstructorNote && scheduleInstructorNote.id) {
							scheduleInstructorNote.instructorComment = privateComment;
							assignmentActionCreators.updateScheduleInstructorNote(scheduleInstructorNote);
						}
						// Create new scheduleInstructorNote
						else {
							assignmentActionCreators.addScheduleInstructorNote(instructor.id, $scope.year, $scope.workgroupId, privateComment);
						}
					}
				});
			};

			$scope.openUnavailabilityModal = function(instructorId) {
				var instructor = $scope.view.state.instructors.list[instructorId];

				var termDisplayNames = {};


				modalInstance = $uibModal.open({
					templateUrl: 'ModalUnavailability.html',
					controller: ModalUnavailabilityCtrl,
					size: 'lg',
					resolve: {
						teachingCallResponses: function () {
							return instructor.teachingCallResponses;
						},
						termDisplayNames: function () {
							return assignmentService.allTerms();
						},
						instructor: function () {
							return instructor;
						}
					}
				});
			};

			$scope.download = function () {
				var isCoursePivot = $scope.view.state.userInterface.showCourses;
				var pivot = isCoursePivot ? "course" : "instructor";

				assignmentService.download($scope.workgroupId, $scope.year, pivot);
			};

			$scope.setActiveTab = function (tabName) {
				$location.search({ tab: tabName });
				switch (tabName) {
					case "instructors":
						$scope.showInstructors();
						break;
					default:
						$scope.showCourses();
						break;
				}
			};

			// Set the active tab according to the URL
			// Otherwise redirect to the default view
			$scope.setActiveTab($routeParams.tab || "courses");

	}]);

AssignmentCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.tab);
	});
};