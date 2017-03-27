/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructionalSupportCallStatusCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportCallStatusActionCreators',
		this.InstructionalSupportCallStatusCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportCallStatusActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.termShortCode = $routeParams.termShortCode;

			$scope.view = {};

			$rootScope.$on('supportCallStatusStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});

			$scope.deleteStudentSupportCall = function(studentSupportCall) {
				instructionalSupportCallStatusActionCreators.deleteStudentSupportCall(studentSupportCall);
			};

			$scope.deleteInstructorSupportCall = function(instructorSupportCall) {
				instructionalSupportCallStatusActionCreators.deleteInstructorSupportCall(instructorSupportCall);
			};

			$scope.numberToFloor = function(number) {
				return Math.floor(number);
			};

			$scope.openAddInstructorsModal = function() {
				$scope.openAddParticipantsSupportCall("instructors");
			};

			$scope.openAddSupportStaffModal = function () {
				$scope.openAddParticipantsSupportCall("supportStaff");
			};

			$scope.openAddParticipantsSupportCall = function(supportCallMode) {

				modalInstance = $uibModal.open({
					templateUrl: 'AddSupportCallModal.html',
					controller: ModalAddSupportCallCtrl,
					size: 'lg',
					resolve: {
						supportCallMode: function () {
							return supportCallMode;
						},
						scheduleId: function () {
							return $scope.view.state.misc.scheduleId;
						},
						state: function () {
							return $scope.view.state;
						},
						year: function () {
							return $scope.year;
						},
						nextYear: function () {
							return $scope.nextYear;
						},
						termShortCode: function () {
							return $scope.termShortCode;
						}
					}
				});
			};
	}]);

InstructionalSupportCallStatusCtrl.getPayload = function (authService, instructionalSupportCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
	});
};