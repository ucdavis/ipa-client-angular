/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
class AssignmentCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, AssignmentActionCreators, AssignmentService, AuthService) {
		var self = this;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.assignmentActionCreators = AssignmentActionCreators;
		this.assignmentService = AssignmentService;
		this.authService = AuthService;

		$window.document.title = "Assignments";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {
			workgroupId: $routeParams.workgroupId
		};

		$scope.unavailabilityModalStyles = { "width": "62%" };
		$scope.isCommentModalOpen = false;
		$scope.isUnavailabilityModalOpen = false;

		$rootScope.$on('assignmentStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.showInstructors = function () {
			self.assignmentActionCreators.showInstructors();
		};

		$scope.showCourses = function () {
			self.assignmentActionCreators.showCourses();
		};

		$scope.termToggled = function (id) {
			self.assignmentActionCreators.toggleTermFilter(id);
		};

		$scope.toggleDisplayCompletedInstructors = function () {
			self.assignmentActionCreators.toggleDisplayCompletedInstructors(!$scope.view.state.filters.showCompletedInstructors);
		};

		$scope.approveInstructorAssignment = function (teachingAssignmentId) {
			var teachingAssignment = $scope.view.state.teachingAssignments.list[teachingAssignmentId];
			self.assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
		};

		$scope.unapproveInstructorAssignment = function(teachingAssignmentId) {
			var teachingAssignment = $scope.view.state.teachingAssignments.list[teachingAssignmentId];
			self.assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
		};

		$scope.addAndApproveInstructorAssignment = function(sectionGroupId, instructorId, termCode) {
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
		$scope.filterTable = function (query) {
			clearTimeout($scope.t);
			$scope.t = setTimeout($scope.startFilter, 700, query);
		};

		$scope.startFilter = function (query) {
			self.assignmentActionCreators.updateTableFilter(query);
		};

		$scope.toggleTag = function (tagId) {
			var tagFilters = $scope.view.state.filters.enabledTagIds;
			var tagIndex = tagFilters.indexOf(tagId);

			if (tagIndex < 0) {
				tagFilters.push(tagId);
			} else {
				tagFilters.splice(tagIndex, 1);
			}

			self.assignmentActionCreators.updateTagFilters(tagFilters);
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

			$scope.view.instructor = instructor;
			$scope.view.privateComment = scheduleInstructorNote.instructorComment;
			$scope.view.scheduleInstructorNote = scheduleInstructorNote;

			if (teachingCallReceipt && teachingCallReceipt.comment) {
				$scope.view.instructorComment = teachingCallReceipt.comment;
			} else {
				$scope.view.instructorComment = "";
			}

			$scope.isCommentModalOpen = true;
			$scope.$apply();
		};

		$scope.openUnavailabilityModal = function(instructorId) {
			var instructor = $scope.view.state.instructors.list[instructorId];

			$scope.view.teachingCallResponses = instructor.teachingCallResponses;
			$scope.view.termDisplayNames = AssignmentService.allTerms();
			$scope.view.instructor = instructor;
			$scope.isUnavailabilityModalOpen = true;
			$scope.$apply();
		};

		$scope.download = function () {
			self.assignmentService.download($scope.workgroupId, $scope.year);
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
		$scope.setActiveTab(this.$routeParams.tab || "courses");

		self.getPayload();
	}

	getPayload () {
		var self = this;

		return this.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			self.assignmentActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year, self.$route.current.params.tab);
		});
	}
}

AssignmentCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', 'AssignmentActionCreators', 'AssignmentService', 'AuthService'];

export default AssignmentCtrl;
