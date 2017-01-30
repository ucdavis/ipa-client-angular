/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructorSupportCallFormCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportInstructorFormActionCreators',
		this.InstructorSupportCallFormCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportInstructorFormActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('instructionalSupportStudentFormStateChanged', function (event, data) {
				$scope.view.state = data.state;
			});

			$scope.addPreference = function(sectionGroupId, supportStaffId) {
				instructionalSupportInstructorFormActionCreators.addInstructorPreference(sectionGroupId, supportStaffId, $scope.view.state.userInterface.supportCallId);
			};

			$scope.deleteInstructorPreference = function(preference) {
				instructionalSupportInstructorFormActionCreators.deleteInstructorPreference(preference, $scope.view.state.studentPreferences);
			};

			$scope.updateSupportCallResponse = function() {
				instructionalSupportInstructorFormActionCreators.updateSupportCallResponse($scope.view.state.supportCallResponse);
			};

			$scope.submitPreferences = function() {
				$scope.view.state.supportCallResponse.submitted = true;
				instructionalSupportInstructorFormActionCreators.submitInstructorPreferences($scope.view.state.supportCallResponse, $scope.workgroupId, $scope.year);
			};

			// Used on 'update preferences' button, since saving is not required again.
			$scope.pretendToastMessage = function() {
				instructionalSupportInstructorFormActionCreators.pretendToastMessage();
			};

			$( "#sortable1" ).sortable({
				placeholder: "sortable-instructor-preference-placeholder",
				axis: "y"
			});
			$( "#sortable2" ).sortable({
				placeholder: "sortable-instructor-preference-placeholder",
				axis: "y"
			});
			$( "#sortable3" ).sortable({
				placeholder: "sortable-instructor-preference-placeholder",
				axis: "y"
			});

	}]);

InstructorSupportCallFormCtrl.getPayload = function (authService, instructionalSupportInstructorFormActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportInstructorFormActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
	});
};