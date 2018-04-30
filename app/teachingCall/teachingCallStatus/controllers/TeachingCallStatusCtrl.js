class TeachingCallStatusCtrl {
	constructor ($scope, $rootScope, $window, $route, $routeParams, $uibModal, TeachingCallStatusActionCreators, TeachingCallStatusService, AuthService) {
		this.AuthService = AuthService;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.TeachingCallStatusActionCreators = TeachingCallStatusActionCreators;
		this.TeachingCallStatusService = TeachingCallStatusService;
		this.AuthService = AuthService;

		$window.document.title = "Teaching Call Status";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {};

		$rootScope.$on('teachingCallStatusStateChanged', function (event, data) {
			$scope.view.state = data;
			console.log(data);
		});

		$scope.toggleInstructor = function(instructor) {
			TeachingCallStatusActionCreators.toggleInstructor(instructor.instructorId);
		};

		$scope.instructorIsSelected = function(instructorId) {
			return $scope.view.state ? $scope.view.state.ui.selectedInstructorIds.indexOf(instructorId) > -1 : false;
		};

		$scope.areAllInstructorsOfTypeSelected = function(instructorTypeId) {
			var allInstructorsAlreadyToggled = true;

			$scope.view.state.calculations.teachingCallsByInstructorType[instructorTypeId].forEach(function(instructor) {
				if ($scope.instructorIsSelected(instructor.instructorId) == false) {
					allInstructorsAlreadyToggled = false;
				}
			});

			return allInstructorsAlreadyToggled;
		};

		$scope.toggleInstructorType = function(instructorTypeId) {
			var allInstructorsAlreadyToggled = $scope.areAllInstructorsOfTypeSelected(instructorTypeId);

			if (allInstructorsAlreadyToggled) {
				TeachingCallStatusActionCreators.unSelectInstructorsByType(instructorTypeId);
			} else {
				TeachingCallStatusActionCreators.selectInstructorsByType(instructorTypeId);
			}
		};

		$scope.atLeastOneInstructorSelected = function() {
			return $scope.view.state ? $scope.view.state.ui.selectedInstructorIds.length > 0 : false;
		};

		// Launches Contact Instructor Modal
		$scope.openContactInstructorsModal = function() {
			modalInstance = $uibModal.open({
				templateUrl: 'ModalContactInstructors.html',
				controller: ModalContactInstructorsCtrl,
				size: 'lg',
				resolve: {
					scheduleYear: function () {
						return $scope.year;
					},
					workgroupId: function () {
						return $scope.workGroupId;
					},
					state: function () {
						return $scope.view.state;
					}
				}
			});

			modalInstance.result.then(function (teachingCallConfig) {
				$scope.contactInstructors($scope.workgroupId, $scope.year, teachingCallConfig);
			},
			function () {
				// Modal closed
			});
		};

		// Triggered on TeachingCall Config submission
		$scope.contactInstructors = function(workgroupId, year, teachingCallConfig) {
			teachingCallConfig.termsBlob = "";
			var allTerms = ['01','02','03','04','05','06','07','08','09','10'];

			for (var i = 0; i < allTerms.length; i++) {
				if (teachingCallConfig.activeTerms[allTerms[i]] === true) {
					teachingCallConfig.termsBlob += "1";
				} else {
					teachingCallConfig.termsBlob += "0";
				}
			}

			delete teachingCallConfig.activeTerms;

			TeachingCallStatusActionCreators.contactInstructors(workgroupId, year, teachingCallConfig, teachingCallConfig.selectedInstructors);
		};


		// Launches Contact Instructor Modal
		$scope.openAddInstructorsModal = function() {
			modalInstance = $uibModal.open({
				templateUrl: 'ModalAddInstructors.html',
				controller: ModalAddInstructorsCtrl,
				size: 'lg',
				resolve: {
					scheduleYear: function () {
						return $scope.year;
					},
					workgroupId: function () {
						return $scope.workGroupId;
					},
					state: function () {
						return $scope.view.state;
					}
				}
			});

			modalInstance.result.then(function (teachingCallConfig) {
				$scope.addInstructorsToTeachingCall($scope.workgroupId, $scope.year, teachingCallConfig);
			},
			function () {
				// Modal closed
			});
		};

		// Triggered on TeachingCall Config submission
		$scope.addInstructorsToTeachingCall = function(workgroupId, year, teachingCallConfig) {
			teachingCallConfig.termsBlob = "";
			var allTerms = ['01','02','03','04','05','06','07','08','09','10'];

			for (var i = 0; i < allTerms.length; i++) {
				if (teachingCallConfig.activeTerms[allTerms[i]] === true) {
					teachingCallConfig.termsBlob += "1";
				} else {
					teachingCallConfig.termsBlob += "0";
				}
			}

			delete teachingCallConfig.activeTerms;

			TeachingCallStatusActionCreators.addInstructorsToTeachingCall(workgroupId, year, teachingCallConfig);
		};

		$scope.removeInstructor = function(instructor) {
			TeachingCallStatusActionCreators.removeInstructorFromTeachingCall($scope.workgroupId, $scope.year, instructor);
		};

		this.getPayload();
	}

	getPayload () {
		var _self = this;
		return _self.AuthService.validate(localStorage.getItem('JWT'), _self.$route.current.params.workgroupId, _self.$route.current.params.year).then(function () {
			_self.TeachingCallStatusActionCreators.getInitialState(_self.$route.current.params.workgroupId, _self.$route.current.params.year);
		});
	}
}

TeachingCallStatusCtrl.$inject = ['$scope', '$rootScope', '$window', '$route', '$routeParams', '$uibModal', 'TeachingCallStatusActionCreators', 'TeachingCallStatusService', 'AuthService'];

export default TeachingCallStatusCtrl;
