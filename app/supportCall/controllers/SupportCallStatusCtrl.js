class SupportCallStatusCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, SupportCallStatusActionCreators, AuthService) {
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.SupportCallStatusActionCreators = SupportCallStatusActionCreators;
		this.AuthService = AuthService;

		var _self = this;
		$window.document.title = "Instructional Support";
		$scope.workgroupId = _self.$routeParams.workgroupId;
		$scope.year = _self.$routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.termShortCode = _self.$routeParams.termShortCode;

		$scope.instructorsSelected = false;
		$scope.supportStaffSelected = false;

		// Generate termCode
		if ($scope.termShortCode < 4) {
			$scope.termCode = (parseInt($scope.year) + 1) + $scope.termShortCode;
		} else {
			$scope.termCode = $scope.year + $scope.termShortCode;
		}

		$scope.view = {
			year: $scope.year,
			nextYear: $scope.nextYear,
			termShortCode: $scope.termShortCode,
			workgroupId: $scope.workgroupId,
			modalStyles: {
				width: "70%"
			}
		};

		_self.$rootScope.$on('supportCallStatusStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.removeInstructor = function(instructor) {
			SupportCallStatusActionCreators.removeInstructorFromSupportCall(instructor, $scope.view.state.misc.scheduleId, $scope.termCode);
		};

		$scope.removeSupportStaff = function(supportStaff) {
			SupportCallStatusActionCreators.removeSupportStaffFromSupportCall(supportStaff, $scope.view.state.misc.scheduleId, $scope.termCode);
		};

		$scope.numberToFloor = function(number) {
			return Math.floor(number);
		};

		$scope.openAddInstructorsModal = function() {
			$scope.openAddParticipantsSupportCall("instructor");
		};

		$scope.openAddSupportStaffModal = function () {
			$scope.openAddParticipantsSupportCall("supportStaff");
		};

		$scope.toggleParticipantSelection = function(participant) {
			if (participant.selected) {
				participant.selected = false;
			} else {
				participant.selected = true;
			}
		};

		$scope.toggleInstructorsSelection = function() {
			$scope.instructorsSelected = !$scope.instructorsSelected;

			$scope.view.state.supportCall.instructors.forEach(function(instructor) {
				instructor.selected = $scope.instructorsSelected;
			});
		};

		$scope.toggleSupportStaffSelection = function() {
			$scope.supportStaffSelected = !$scope.supportStaffSelected;

			$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
				slotSupportStaff.selected = $scope.supportStaffSelected;
			});
		};

		$scope.atLeastOneInstructorSelected = function() {
			var instructorIsSelected = false;

			if ($scope.view.state) {
				$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					if (instructor.selected) {
						instructorIsSelected = true;
					}
				});
			}

			return instructorIsSelected;
		};

		$scope.atLeastOneStudentSelected = function() {
			var instructorIsSelected = false;

			if ($scope.view.state) {
				$scope.view.state.supportCall.supportStaff.forEach(function(participant) {
					if (participant.selected) {
						instructorIsSelected = true;
					}
				});
			}

			return instructorIsSelected;
		};

		$scope.openAddParticipantsSupportCall = function(supportCallMode) {
			$scope.view.supportCallMode = supportCallMode;
			$scope.view.state.openAddSupportCallModal = true;
		};

		$scope.openContactStudentsModal = function() {
			$scope.openContactParticipantModal("supportStaff");
		};

		$scope.openContactInstructorsModal = function() {
			$scope.openContactParticipantModal("instructor");
		};

		// Launches Contact Modal
		$scope.openContactParticipantModal = function(supportCallMode) {
			let selectedParticipants = [];

			if (supportCallMode == "instructor") {
				$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					if (instructor.selected) {
						selectedParticipants.push(instructor);
					}
				});
			}
			if (supportCallMode == "supportStaff") {
				$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
					if (slotSupportStaff.selected) {
						selectedParticipants.push(slotSupportStaff);
					}
				});
			}
			$scope.view.supportCallMode = supportCallMode;
			$scope.view.selectedParticipants = selectedParticipants;
			$scope.view.state.openContactModal = true;
		};
	}
}

SupportCallStatusCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'SupportCallStatusActionCreators', 'AuthService'];

export default SupportCallStatusCtrl;
