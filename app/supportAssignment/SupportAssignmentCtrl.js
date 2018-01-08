/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
supportAssignmentApp.controller('SupportAssignmentCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'supportActions', '$timeout',
		this.SupportAssignmentCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, supportActions, $timeout) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termShortCode = $routeParams.termShortCode;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$scope.availabilityModalStyles = {
				width: "70%"
			};

			$scope.closeAvailabilityModal = function() {
				supportActions.closeAvailabilityModal();
			};

			$rootScope.$on('sharedStateSet', function (event, sharedStateData) {
				$rootScope.$on('supportAssignmentStateChanged', function (event, data) {
					$scope.sharedState = sharedStateData;
					var isInstructorReviewOpen = $scope.isInstructorSupportCallReviewOpen();
					var isStudentReviewOpen = $scope.isSupportStaffSupportCallReviewOpen();
					var userRoles = $scope.sharedState.currentUser.userRoles;

					// Default access to none
					$scope.isAllowed = false;
					$scope.readOnlyMode = false;

					// Determine access level
					userRoles.forEach(function(userRole) {
						if (userRole.roleName == "academicPlanner" || userRole.roleName == "admin") {
							$scope.isAllowed = true;
							$scope.readOnlyMode = false;
						}
					});

					// If access has not yet been set
					if ($scope.isAllowed == false) {
						// Check if this is an instructor reviewing the support assignments
						if (isInstructorReviewOpen) {
							userRoles.forEach(function(userRole) {
								if (userRole.roleName == "federationInstructor" || userRole.roleName == "senateInstructor") {
									$scope.isAllowed = true;
									$scope.readOnlyMode = true;
								}
							});
						}

						// Check if this is a student reviewing the support assignments
						if (isStudentReviewOpen) {
							userRoles.forEach(function(userRole) {
								if (userRole.roleName == "studentPhd" || userRole.roleName == "studentMasters" || userRole.roleName == "instructionalSupport") {
									$scope.isAllowed = true;
									$scope.readOnlyMode = true;
								}
							});
						}
					}

					if ($scope.readOnlyMode == true && $scope.isAllowed == false && $scope.view.state.ui.readOnlyMode == false) {
						supportActions.setReadOnlyMode();
					}
				});
			});

			$rootScope.$on('supportAssignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);

				// Resolves occasional discrepancies with view binding, because we're using event listeners
				$timeout(function() {
					$scope.$apply();
				});
			});

			$scope.isInstructorSupportCallReviewOpen = function () {
				var index = parseInt($scope.termShortCode) - 1;

				if ( !($scope.view.state.schedule.instructorSupportCallReviewOpen)){
					return false;
				}

				var value = $scope.view.state.schedule.instructorSupportCallReviewOpen[index];
				var results = (value == "1");

				return results;
			};

			$scope.isSupportStaffSupportCallReviewOpen = function () {
				var index = parseInt($scope.termShortCode) - 1;

				if ( !($scope.view.state.schedule.supportStaffSupportCallReviewOpen)){
					return false;
				}

				var value = $scope.view.state.schedule.supportStaffSupportCallReviewOpen[index];
				var results = (value == "1");

				return results;
			};

			$scope.startFilter = function (query) {
				supportActions.updateTableFilter(query);
			};

			$scope.setActiveTab = function (tabName) {
				$location.search({ tab: tabName });
				switch (tabName) {
					case "instructionalSupportStaff":
						//$scope.showInstructors();
						break;
					default:
						//$scope.showCourses();
						break;
				}
			};

			$scope.appointmentTypeToShorthand = function(appointmentType) {
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

			$scope.isTeachingAssistant = function (instructionalSupportAssignment) {
				if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "teachingAssistant") {
					return true;
				}
				return false;
			};

			$scope.isReader = function (instructionalSupportAssignment) {
				if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "reader") {
					return true;
				}
				return false;
			};

			$scope.isAssociateInstructor = function (instructionalSupportAssignment) {
				if (instructionalSupportAssignment && instructionalSupportAssignment.appointmentType == "associateInstructor") {
					return true;
				}
				return false;
			};

			$scope.isUnassigned = function (instructionalSupportAssignment) {
				if (instructionalSupportAssignment.instructionalSupportStaffId === 0) {
					return true;
				}

				return false;
			};

			// Will delete an empty assignment
			$scope.deleteAssignment = function (instructionalSupportAssignment) {
				supportActions.deleteAssignment(instructionalSupportAssignment);
			};

			$scope.removeStaffFromSlot = function (supportAssignment) {
				var supportStaffId = supportAssignment.supportStaffId;
				supportActions.removeStaffFromSlot(supportAssignment.id, supportStaffId);
			};

			// Set the active tab according to the URL
			// Otherwise redirect to the default view
			$scope.setActiveTab($routeParams.tab || "courses");
	}]);

SupportAssignmentCtrl.getPayload = function (authService, supportActions, $route, $window) {
	// Validate params
	if (!($route.current.params.workgroupId) || !($route.current.params.year)) {
		$window.location.href = "/summary/";
	} else {
		authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
			supportActions.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode, $route.current.params.tab);
		});
	}
};