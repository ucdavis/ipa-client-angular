teachingCallApp.controller('TeachingCallStatusCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$uibModal', 'teachingCallStatusActionCreators', 'teachingCallStatusService',
		this.TeachingCallStatusCtrl = function ($scope, $rootScope, $window, $routeParams, $uibModal, teachingCallStatusActionCreators, teachingCallStatusService) {

			$scope.modalShown = false;
			$scope.toggleModal = function() {
				$scope.modalShown = !$scope.modalShown;
			};

			$window.document.title = "Teaching Call Status";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$scope.selectedInstructors = [];
			$scope.senateInstructorsSelected = false;
			$scope.federationInstructorsSelected = false;

			$rootScope.$on('teachingCallStatusStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$scope.toggleSelectedInstructor = function(instructor) {
				instructor.selected = !instructor.selected;
			};

			$scope.toggleSenateInstructors = function() {
				$scope.senateInstructorsSelected = !$scope.senateInstructorsSelected;

				$scope.view.state.teachingCall.senate.forEach(function(instructor) {
					instructor.selected = $scope.senateInstructorsSelected;
				});
			};

			$scope.toggleFederationInstructors = function() {
				$scope.federationInstructorsSelected = !$scope.federationInstructorsSelected;

				$scope.view.state.teachingCall.federation.forEach(function(instructor) {
					instructor.selected = $scope.federationInstructorsSelected;
				});
			};

			$scope.atLeastOneInstructorSelected = function() {
				var instructorIsSelected = false;

				if ($scope.view.state) {
					$scope.view.state.teachingCall.senate.forEach(function(instructor) {
						if (instructor.selected) {
							instructorIsSelected = true;
						}
					});
					$scope.view.state.teachingCall.federation.forEach(function(instructor) {
						if (instructor.selected) {
							instructorIsSelected = true;
						}
					});
				}

				return instructorIsSelected;
			};

			// Launches Contact Instructor Modal
			$scope.openContactInstructorsModal = function() {
				selectedInstructors = [];
				$scope.view.state.teachingCall.senate.forEach(function(instructor) {
					if (instructor.selected) {
						selectedInstructors.push(instructor);
					}
				});
				$scope.view.state.teachingCall.federation.forEach(function(instructor) {
					if (instructor.selected) {
						selectedInstructors.push(instructor);
					}
				});

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
						},
						selectedInstructors: function () {
							return selectedInstructors;
						}
					}
				});

				modalInstance.result.then(function (teachingCallConfig) {
					$scope.contactInstructors($scope.workgroupId, $scope.year, teachingCallConfig);
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

				teachingCallStatusActionCreators.contactInstructors(workgroupId, year, teachingCallConfig, teachingCallConfig.selectedInstructors);
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

				teachingCallStatusActionCreators.addInstructorsToTeachingCall(workgroupId, year, teachingCallConfig);
			};

			$scope.removeInstructor = function(instructor) {
				teachingCallStatusActionCreators.removeInstructorFromTeachingCall($scope.workgroupId, $scope.year, instructor);
			};
	}]);

TeachingCallStatusCtrl.validate = function (authService, teachingCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		teachingCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};