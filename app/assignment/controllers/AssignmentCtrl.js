/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
class AssignmentCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, AssignmentActionCreators, AssignmentService, AuthService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.assignmentActionCreators = AssignmentActionCreators;
		this.assignmentService = AssignmentService;
		this.authService = AuthService;

		$window.document.title = "Assignments";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {};

		this.getPayload().then( function() {
			self.initialize();
		});
	}

	initialize () {
		var self = this;
		this.$rootScope.$on('assignmentStateChanged', function (event, data) {
			self.$scope.view.state = data;
		});

		this.$scope.showInstructors = function () {
			self.assignmentActionCreators.showInstructors();
		};

		this.$scope.showCourses = function () {
			self.assignmentActionCreators.showCourses();
		};

		this.$scope.termToggled = function (id) {
			self.assignmentActionCreators.toggleTermFilter(id);
		};

		this.$scope.toggleDisplayCompletedInstructors = function () {
			self.assignmentActionCreators.toggleDisplayCompletedInstructors(!self.$scope.view.state.filters.showCompletedInstructors);
		};

		this.$scope.approveInstructorAssignment = function (teachingAssignmentId) {
			var teachingAssignment = self.$scope.view.state.teachingAssignments.list[teachingAssignmentId];
			self.assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
		};

		this.$scope.unapproveInstructorAssignment = function(teachingAssignmentId) {
			var teachingAssignment = self.$scope.view.state.teachingAssignments.list[teachingAssignmentId];
			self.assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
		};

		this.$scope.addAndApproveInstructorAssignment = function(sectionGroupId, instructorId, termCode) {
			var teachingAssignment = {
				sectionGroupId: sectionGroupId,
				instructorId: instructorId,
				termCode: termCode,
				priority: 1,
				approved: true
			};

			self.assignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment);
		};

		// Triggered by global search field, redraws table based on query
		this.$scope.filterTable = function (query) {
			clearTimeout(self.$scope.t);
			self.$scope.t = setTimeout(self.$scope.startFilter, 700, query);
		};

		this.$scope.startFilter = function (query) {
			self.assignmentActionCreators.updateTableFilter(query);
		};

		this.$scope.toggleTag = function (tagId) {
			var tagFilters = self.$scope.view.state.filters.enabledTagIds;
			var tagIndex = tagFilters.indexOf(tagId);

			if (tagIndex < 0) {
				tagFilters.push(tagId);
			} else {
				tagFilters.splice(tagIndex, 1);
			}

			self.assignmentActionCreators.updateTagFilters(tagFilters);
		};

		// Launched from the instructorTable directive UI handler
		this.$scope.openCommentModal = function(instructorId) {
			var instructor = self.$scope.view.state.instructors.list[instructorId];
			var scheduleInstructorNote = {};

			// Create new scheduleInstructorNote object if one does not already exist
			if (instructor.scheduleInstructorNoteId) {
				scheduleInstructorNote = self.$scope.view.state.scheduleInstructorNotes.list[instructor.scheduleInstructorNoteId];
			} else {
				scheduleInstructorNote = {};
				scheduleInstructorNote.instructorComment = "";
			}

			// Find a teachingCallReceipt for this instructor and schedule, if one exists.
			var teachingCallReceipt = null;

			for (var i = 0; i < self.$scope.view.state.teachingCallReceipts.ids.length; i++) {
				teachingCallReceipt = self.$scope.view.state.teachingCallReceipts.list[self.$scope.view.state.teachingCallReceipts.ids[i]];

				if (teachingCallReceipt.instructorId == instructor.id) {
					break;
				}
			}

			modalInstance = this.$uibModal.open({
				templateUrl: require('./../templates/ModalComment.html'),
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
			},
			function () {
				// Modal closed
			});
		};

		this.$scope.openUnavailabilityModal = function(instructorId) {
			var instructor = $scope.view.state.instructors.list[instructorId];

			var termDisplayNames = {};

			modalInstance = $uibModal.open({
				template: require('./../templates/ModalUnavailability.html'),
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

			modalInstance.result.then(function () {
				// This modal does not 'submit' in a traditional sense.
			},
			function () {
				// Modal closed
			});
		};

		this.$scope.download = function () {
			self.assignmentService.download(this.$scope.workgroupId, this.$scope.year);
		};

		this.$scope.setActiveTab = function (tabName) {
			self.$location.search({ tab: tabName });
			switch (tabName) {
				case "instructors":
					self.$scope.showInstructors();
					break;
				default:
					self.$scope.showCourses();
					break;
			}
		};

		// Set the active tab according to the URL
		// Otherwise redirect to the default view
		this.$scope.setActiveTab(this.$routeParams.tab || "courses");
	}

	getPayload () {
		var self = this;

		return this.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			self.assignmentActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year, self.$route.current.params.tab);
		});
	}
}

AssignmentCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'AssignmentActionCreators', 'AssignmentService', 'AuthService'];

export default AssignmentCtrl;
