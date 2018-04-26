/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
class SupportCallStatusCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, SupportCallStatusActionCreators, AuthService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.SupportCallStatusActionCreators = SupportCallStatusActionCreators;
		this.AuthService = AuthService;

		var self = this;
		self.$window.document.title = "Instructional Support";
		self.$scope.workgroupId = self.$routeParams.workgroupId;
		self.$scope.year = self.$routeParams.year;
		self.$scope.nextYear = (parseInt(self.$scope.year) + 1).toString().slice(-2);
		self.$scope.termShortCode = self.$routeParams.termShortCode;

		self.$scope.instructorsSelected = false;
		self.$scope.supportStaffSelected = false;

		// Generate termCode
		if (self.$scope.termShortCode < 4) {
			self.$scope.termCode = (parseInt(self.$scope.year) + 1) + self.$scope.termShortCode;
		} else {
			self.$scope.termCode = self.$scope.year + self.$scope.termShortCode;
		}

		self.$scope.view = {};

		this.getPayload().then( function() {
			self.initialize();
		});
	}

	initialize () {
		var self = this;
		self.$rootScope.$on('supportCallStatusStateChanged', function (event, data) {
			self.$scope.view.state = data;
		});

		self.$scope.removeInstructor = function(instructor) {
			SupportCallStatusActionCreators.removeInstructorFromSupportCall(instructor, self.$scope.view.state.misc.scheduleId, self.$scope.termCode);
		};

		self.$scope.removeSupportStaff = function(supportStaff) {
			SupportCallStatusActionCreators.removeSupportStaffFromSupportCall(supportStaff, self.$scope.view.state.misc.scheduleId, self.$scope.termCode);
		};

		self.$scope.numberToFloor = function(number) {
			return Math.floor(number);
		};

		self.$scope.openAddInstructorsModal = function() {
			self.$scope.openAddParticipantsSupportCall("instructor");
		};

		self.$scope.openAddSupportStaffModal = function () {
			self.$scope.openAddParticipantsSupportCall("supportStaff");
		};

		self.$scope.toggleParticipantSelection = function(participant) {
			if (participant.selected) {
				participant.selected = false;
			} else {
				participant.selected = true;
			}
		};

		self.$scope.toggleInstructorsSelection = function() {
			self.$scope.instructorsSelected = !self.$scope.instructorsSelected;

			self.$scope.view.state.supportCall.instructors.forEach(function(instructor) {
				instructor.selected = self.$scope.instructorsSelected;
			});
		};

		self.$scope.toggleSupportStaffSelection = function() {
			self.$scope.supportStaffSelected = !self.$scope.supportStaffSelected;

			self.$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
				slotSupportStaff.selected = self.$scope.supportStaffSelected;
			});
		};

		self.$scope.atLeastOneInstructorSelected = function() {
			var instructorIsSelected = false;

			if (self.$scope.view.state) {
				self.$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					if (instructor.selected) {
						instructorIsSelected = true;
					}
				});
			}

			return instructorIsSelected;
		};

		self.$scope.atLeastOneStudentSelected = function() {
			var instructorIsSelected = false;

			if (self.$scope.view.state) {
				self.$scope.view.state.supportCall.supportStaff.forEach(function(participant) {
					if (participant.selected) {
						instructorIsSelected = true;
					}
				});
			}

			return instructorIsSelected;
		};

		self.$scope.openAddParticipantsSupportCall = function(supportCallMode) {
			modalInstance = self.$uibModal.open({
				template: require('./../directives/modalAddSupportCall/AddSupportCallModal.html'),
				controller: ModalAddSupportCallCtrl,
				size: 'lg',
				resolve: {
					supportCallMode: function () {
						return supportCallMode;
					},
					scheduleId: function () {
						return self.$scope.view.state.misc.scheduleId;
					},
					state: function () {
						return self.$scope.view.state;
					},
					year: function () {
						return self.$scope.year;
					},
					nextYear: function () {
						return self.$scope.nextYear;
					},
					termShortCode: function () {
						return self.$scope.termShortCode;
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

		self.$scope.openContactStudentsModal = function() {
			self.$scope.openContactParticipantModal("supportStaff");
		};

		self.$scope.openContactInstructorsModal = function() {
			self.$scope.openContactParticipantModal("instructor");
		};

		// Launches Contact Modal
		self.$scope.openContactParticipantModal = function(supportCallMode) {
			selectedParticipants = [];

			if (supportCallMode == "instructor") {
				self.$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					if (instructor.selected) {
						selectedParticipants.push(instructor);
					}
				});
			}
			if (supportCallMode == "supportStaff") {
				self.$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
					if (slotSupportStaff.selected) {
						selectedParticipants.push(slotSupportStaff);
					}
				});
			}

			modalInstance = self.$uibModal.open({
				templateUrl: 'ContactSupportCallModal.html',
				controller: ModalContactSupportCallCtrl,
				size: 'lg',
				resolve: {
					supportCallMode: function () {
						return supportCallMode;
					},
					scheduleId: function () {
						return self.$scope.view.state.misc.scheduleId;
					},
					state: function () {
						return self.$scope.view.state;
					},
					year: function () {
						return self.$scope.year;
					},
					termShortCode: function () {
						return self.$scope.termShortCode;
					},
					selectedParticipants: function () {
						return selectedParticipants;
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
	}

	getPayload () {
		var self = this;
		return self.AuthService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			self.SupportCallStatusActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year, self.$route.current.params.termShortCode);
		});	
	}
}

SupportCallStatusCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'SupportCallStatusActionCreators', 'AuthService'];

export default SupportCallStatusCtrl;
