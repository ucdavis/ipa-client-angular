/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
class SupportAssignmentCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, SupportActions, $timeout, AuthService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.SupportActions = SupportActions;
		this.$timeout = $timeout;
		this.AuthService = AuthService;

		var here = this;
		$window.document.title = "Instructional Support";
		$scope.workgroupId = here.$routeParams.workgroupId;
		$scope.year = here.$routeParams.year;
		$scope.termShortCode = here.$routeParams.termShortCode;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {};

		$scope.availabilityModalStyles = {
			width: "70%"
		};

		this.getPayload().then( function() {
			here.initialize();
		});
	}

	initialize () {
		var here = this;
		here.$scope.closeAvailabilityModal = function() {
			SupportActions.closeAvailabilityModal();
		};

		here.$scope.sharedState = here.AuthService.getSharedState();

		here.$rootScope.$on('sharedStateSet', function (event, sharedStateData) {
			here.$scope.sharedState = here.AuthService.getSharedState();
		});

		here.$rootScope.$on('supportAssignmentStateChanged', function (event, data) {
			here.$scope.view.state = data;

			// Resolves occasional discrepancies with view binding, because we're using event listeners
			here.$timeout(function() {
				here.$scope.$apply();
			});

			var isInstructorReviewOpen = here.$scope.isInstructorSupportCallReviewOpen();
			var isStudentReviewOpen = here.$scope.isSupportStaffSupportCallReviewOpen();
			var userRoles = here.$scope.sharedState.currentUser.userRoles;

			// Default access to none
			here.$scope.isAllowed = false;
			here.$scope.readOnlyMode = false;

			// Determine access level
			userRoles.forEach(function(userRole) {
				if (userRole.roleName == "academicPlanner" || userRole.roleName == "admin") {
					here.$scope.isAllowed = true;
					here.$scope.readOnlyMode = false;
				}
			});

			// If access has not yet been set
			if (here.$scope.isAllowed == false) {
				// Check if this is an instructor reviewing the support assignments
				if (isInstructorReviewOpen) {
					userRoles.forEach(function(userRole) {
						if (userRole.roleName == "instructor") {
							here.$scope.isAllowed = true;
							here.$scope.readOnlyMode = true;
						}
					});
				}

				// Check if this is a student reviewing the support assignments
				if (isStudentReviewOpen) {
					userRoles.forEach(function(userRole) {
						if (userRole.roleName == "studentPhd" || userRole.roleName == "studentMasters" || userRole.roleName == "instructionalSupport") {
							here.$scope.isAllowed = true;
							here.$scope.readOnlyMode = true;
						}
					});
				}
			}

			if (here.$scope.readOnlyMode == true && here.$scope.isAllowed == true && here.$scope.view.state.ui.readOnlyMode == false) {
				SupportActions.setReadOnlyMode();
			}
		});

		here.$scope.isInstructorSupportCallReviewOpen = function () {
			var index = parseInt(here.$scope.termShortCode) - 1;

			if ( !(here.$scope.view.state.schedule.instructorSupportCallReviewOpen)){
				return false;
			}

			var value = here.$scope.view.state.schedule.instructorSupportCallReviewOpen[index];
			var results = (value == "1");

			return results;
		};

		here.$scope.isSupportStaffSupportCallReviewOpen = function () {
			var index = parseInt(here.$scope.termShortCode) - 1;

			if ( !(here.$scope.view.state.schedule.supportStaffSupportCallReviewOpen)){
				return false;
			}

			var value = here.$scope.view.state.schedule.supportStaffSupportCallReviewOpen[index];
			var results = (value == "1");

			return results;
		};

		here.$scope.startFilter = function (query) {
			SupportActions.updateTableFilter(query);
		};

		here.$scope.setActiveTab = function (tabName) {
			here.$location.search({ tab: tabName });
			switch (tabName) {
				case "instructionalSupportStaff":
					//$scope.showInstructors();
					break;
				default:
					//$scope.showCourses();
					break;
			}
		};

		here.$scope.appointmentTypeToShorthand = function(appointmentType) {
			switch(appointmentType) {
				case "teachingAssistant":
					return "TA";
				case "reader":
					return "Reader";
				case "associateInstructor":
					return "AI";
			}

			return "";
		};

		here.$scope.isTeachingAssistant = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "teachingAssistant") {
				return true;
			}
			return false;
		};

		here.$scope.isReader = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "reader") {
				return true;
			}
			return false;
		};

		here.$scope.isAssociateInstructor = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "associateInstructor") {
				return true;
			}
			return false;
		};

		here.$scope.isUnassigned = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment.instructionalSupportStaffId === 0) {
				return true;
			}

			return false;
		};

		// Will delete an empty assignment
		here.$scope.deleteAssignment = function (instructionalSupportAssignment) {
			SupportActions.deleteAssignment(instructionalSupportAssignment);
		};

		here.$scope.removeStaffFromSlot = function (supportAssignment) {
			var supportStaffId = supportAssignment.supportStaffId;
			SupportActions.removeStaffFromSlot(supportAssignment.id, supportStaffId);
		};

		// Set the active tab according to the URL
		// Otherwise redirect to the default view
		here.$scope.setActiveTab(here.$routeParams.tab || "courses");
	}

	getPayload () {
		var _self = this;
	// Validate params
	if (!(_self.$route.current.params.workgroupId) || !(_self.$route.current.params.year)) {
		_self.$window.location.href = "/summary/";
	} else {
		return _self.AuthService.validate(localStorage.getItem('JWT'), _self.$route.current.params.workgroupId, _self.$route.current.params.year).then(function () {
			if (_self.$route.current.params.workgroupId && _self.$route.current.params.year) {
				_self.SupportActions.getInitialState(_self.$route.current.params.workgroupId, _self.$route.current.params.year, _self.$route.current.params.termShortCode, _self.$route.current.params.tab);
			}
		});
	}

	}
}

SupportAssignmentCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'SupportActions', '$timeout', 'AuthService'];

export default SupportAssignmentCtrl;
