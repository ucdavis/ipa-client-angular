teachingCallApp.controller('TeachingCallStatusCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$uibModal', 'teachingCallStatusActionCreators', 'teachingCallStatusService',
		this.TeachingCallStatusCtrl = function ($scope, $rootScope, $window, $routeParams, $uibModal, teachingCallStatusActionCreators, teachingCallStatusService) {
			$window.document.title = "Teaching Call Status";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('teachingCallStatusStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			// Launches TeachingCall Config modal and controller
			$scope.openTeachingCallConfig = function() {
				modalInstance = $uibModal.open({
					templateUrl: 'ModalTeachingCallConfig.html',
					controller: ModalTeachingCallConfigCtrl,
					size: 'lg',
					resolve: {
						scheduleYear: function () {
							return $scope.year;
						},
						workgroupId: function () {
							return $scope.workgroupId;
						},
						viewState: function () {
							return $scope.view.state;
						},
						allTerms: function () {
							return teachingCallStatusService.allTerms();
						}
					}
				});

				modalInstance.result.then(function (teachingCallConfig) {
					$scope.startTeachingCall($scope.workgroupId, $scope.year, teachingCallConfig);
				});
			};

			// Triggered on TeachingCall Config submission
			$scope.startTeachingCall = function(workgroupId, year, teachingCallConfig) {
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

				assignmentActionCreators.createTeachingCall(workgroupId, year, teachingCallConfig);
			};

			$scope.deleteTeachingCall = function (teachingCall) {
				assignmentActionCreators.deleteTeachingCall(teachingCall);
			};
	}]);

TeachingCallStatusCtrl.validate = function (authService, teachingCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		teachingCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};