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

		var _self = this;
		$window.document.title = "Instructional Support";
		$scope.workgroupId = _self.$routeParams.workgroupId;
		$scope.year = _self.$routeParams.year;
		$scope.termShortCode = _self.$routeParams.termShortCode;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {};

		$scope.availabilityModalStyles = {
			width: "70%"
		};

		_self.initialize();
	}

	initialize () {
		var _self = this;
		_self.$scope.closeAvailabilityModal = function() {
			_self.SupportActions.closeAvailabilityModal();
		};

		_self.$scope.sharedState = _self.AuthService.getSharedState();

		_self.$rootScope.$on('sharedStateSet', function () {
			_self.$scope.sharedState = _self.AuthService.getSharedState();
		});

		_self.$rootScope.$on('supportAssignmentStateChanged', function (event, data) {
			_self.$scope.view.state = data;

			// Resolves occasional discrepancies with view binding, because we're using event listeners
			_self.$timeout(function() {
				_self.$scope.$apply();
			});

			var isInstructorReviewOpen = _self.$scope.isInstructorSupportCallReviewOpen();
			var isStudentReviewOpen = _self.$scope.isSupportStaffSupportCallReviewOpen();
			var userRoles = _self.$scope.sharedState.currentUser.userRoles;

			// Default access to none
			_self.$scope.isAllowed = false;
			_self.$scope.readOnlyMode = false;

			// Determine access level
			userRoles.forEach(function(userRole) {
				if ((userRole.roleName == "academicPlanner" || userRole.roleName == "admin") && userRole.workgroupId == _self.$scope.workgroupId) {
					_self.$scope.isAllowed = true;
					_self.$scope.readOnlyMode = false;
				}
			});

			// If access has not yet been set
			if (_self.$scope.isAllowed == false) {
				// Check if this is an instructor reviewing the support assignments
				if (isInstructorReviewOpen) {
					userRoles.forEach(function(userRole) {
						if (userRole.roleName == "instructor" && userRole.workgroupId == _self.$scope.workgroupId) {
							_self.$scope.isAllowed = true;
							_self.$scope.readOnlyMode = true;
						}
					});
				}

				// Check if this is a student reviewing the support assignments
				if (isStudentReviewOpen) {
					userRoles.forEach(function(userRole) {
						if ((userRole.roleName == "studentPhd" || userRole.roleName == "studentMasters" || userRole.roleName == "instructionalSupport") && userRole.workgroupId == _self.$scope.workgroupId) {
							_self.$scope.isAllowed = true;
							_self.$scope.readOnlyMode = true;
						}
					});
				}
			}

			if (_self.$scope.readOnlyMode == true && _self.$scope.isAllowed == true && _self.$scope.view.state.ui.readOnlyMode == false) {
				_self.SupportActions.setReadOnlyMode();
			}
		});

		_self.$scope.isInstructorSupportCallReviewOpen = function () {
			var index = parseInt(_self.$scope.termShortCode) - 1;

			if ( !(_self.$scope.view.state.schedule.instructorSupportCallReviewOpen)){
				return false;
			}

			var value = _self.$scope.view.state.schedule.instructorSupportCallReviewOpen[index];
			var results = (value == "1");

			return results;
		};

		_self.$scope.isSupportStaffSupportCallReviewOpen = function () {
			var index = parseInt(_self.$scope.termShortCode) - 1;

			if ( !(_self.$scope.view.state.schedule.supportStaffSupportCallReviewOpen)){
				return false;
			}

			var value = _self.$scope.view.state.schedule.supportStaffSupportCallReviewOpen[index];
			var results = (value == "1");

			return results;
		};

		_self.$scope.setActiveTab = function (tabName) {
			_self.$location.search({ tab: tabName });
			switch (tabName) {
				case "instructionalSupportStaff":
					//$scope.showInstructors();
					break;
				default:
					//$scope.showCourses();
					break;
			}
		};

		_self.$scope.appointmentTypeToShorthand = function(appointmentType) {
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

		_self.$scope.isTeachingAssistant = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "teachingAssistant") {
				return true;
			}
			return false;
		};

		_self.$scope.isReader = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "reader") {
				return true;
			}
			return false;
		};

		_self.$scope.isAssociateInstructor = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "associateInstructor") {
				return true;
			}
			return false;
		};

		_self.$scope.isUnassigned = function (instructionalSupportAssignment) {
			if (instructionalSupportAssignment.instructionalSupportStaffId === 0) {
				return true;
			}

			return false;
		};

		// Set the active tab according to the URL
		// Otherwise redirect to the default view
		_self.$scope.setActiveTab(_self.$routeParams.tab || "courses");
	}
}

SupportAssignmentCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'SupportActions', '$timeout', 'AuthService'];

export default SupportAssignmentCtrl;
