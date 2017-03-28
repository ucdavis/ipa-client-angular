/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructionalSupportAssignmentCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportAssignmentActionCreators', '$timeout',
		this.InstructionalSupportAssignmentCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportAssignmentActionCreators, $timeout) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termShortCode = $routeParams.termShortCode;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('sharedStateSet', function (event, sharedStateData) {
				$rootScope.$on('supportAssignmentStateChanged', function (event, data) {
					$scope.sharedState = sharedStateData;

					var isInstructorReviewOpen = data.state.schedule.instructorSupportCallReviewOpen;
					var isStudentReviewOpen = data.state.schedule.studentSupportCallReviewOpen;
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
				});
			});

			$rootScope.$on('supportAssignmentStateChanged', function (event, data) {
				$scope.view.state = data.state;

				// Resolves occasional discrepancies with view binding, because we're using event listeners
				$timeout(function() {
					$scope.$apply();
				});
			});

			// Triggered by global search field, redraws table based on query
			$scope.filterTable = function (query) {
				clearTimeout($scope.t);
				$scope.t = setTimeout($scope.startFilter, 700, query);
			};

			$scope.startFilter = function (query) {
				instructionalSupportAssignmentActionCreators.updateTableFilter(query);
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

			$scope.openAddAppointmentSlotModal = function(sectionGroupId, appointmentType) {

				modalInstance = $uibModal.open({
					templateUrl: 'AddAssignmentSlotModal.html',
					controller: ModalAddAssignmentSlotCtrl,
					size: 'xs',
					resolve: {
						appointmentType: function () {
							return appointmentType;
						},
						sectionGroupId: function () {
							return sectionGroupId;
						}
					}
				});
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

			$scope.togglePivotView = function (viewName) {
				instructionalSupportAssignmentActionCreators.togglePivotView(viewName);
			};

			// Will delete an empty assignment
			$scope.deleteAssignment = function (instructionalSupportAssignment) {
				instructionalSupportAssignmentActionCreators.deleteAssignment(instructionalSupportAssignment);
			};

			$scope.removeStaffFromSlot = function (instructionalSupportAssignmentId) {
				supportStaffId = $scope.view.state.instructionalSupportAssignments.list[instructionalSupportAssignmentId].instructionalSupportStaffId;
				instructionalSupportAssignmentActionCreators.removeStaffFromSlot(instructionalSupportAssignmentId, supportStaffId);
			};

			$scope.getTermDescription = function(term) {
				var endingYear = "";
				if (term && term.length == 6) {
					endingYear = term.substring(0,4);
					term = term.slice(-2);
				}

				termNames = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};

				return termNames[term];
			};

			$scope.getTermYearDescription = function(term, year) {

				var description = "";
				if (parseInt(term) < 4) {
					year = parseInt(year) + 1;
				}

				description = $scope.getTermDescription(term) + " " + year;
				return description;
			};

			$scope.openStudentSupportCallReview = function() {
				instructionalSupportAssignmentActionCreators.openStudentSupportCallReview($scope.view.state.schedule.id);
			};

			$scope.openInstructorSupportCallReview = function() {
				instructionalSupportAssignmentActionCreators.openInstructorSupportCallReview($scope.view.state.schedule.id);
			};

			$scope.termYearDescription = $scope.getTermYearDescription($scope.termShortCode, $scope.year);

			// Set the active tab according to the URL
			// Otherwise redirect to the default view
			$scope.setActiveTab($routeParams.tab || "courses");
	}]);

InstructionalSupportAssignmentCtrl.getPayload = function (authService, instructionalSupportAssignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportAssignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode, $route.current.params.tab);
	});
};