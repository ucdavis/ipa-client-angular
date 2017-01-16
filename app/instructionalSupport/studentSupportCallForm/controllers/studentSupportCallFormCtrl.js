/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('StudentSupportCallFormCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportStudentFormActionCreators',
		this.StudentSupportCallFormCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportStudentFormActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};
			
			$rootScope.$on('instructionalSupportStudentFormStateChanged', function (event, data) {
				$scope.view.state = data.state;
			});

			$scope.addPreference = function(preference) {
				instructionalSupportStudentFormActionCreators.addStudentPreference(preference, $scope.view.state, $scope.view.state.userInterface.supportCallId);
			};

			$scope.deletePreference = function(preference) {
				instructionalSupportStudentFormActionCreators.deleteStudentPreference(preference);
			};

			$scope.updateSupportCallResponse = function() {
				instructionalSupportStudentFormActionCreators.updateSupportCallResponse($scope.view.state.supportCallResponse);
			};

			$scope.submitPreferences = function() {
				$scope.view.state.supportCallResponse.submitted = true;
				instructionalSupportStudentFormActionCreators.submitPreferences($scope.view.state.supportCallResponse, $scope.workgroupId, $scope.year);

			};

			$scope.updatePreferencesOrder = function(preferenceIds) {
				instructionalSupportStudentFormActionCreators.updatePreferencesOrder(preferenceIds, $scope.view.state.supportCall.scheduleId, $scope.termCode);
			}
			$scope.pretendToastMessage = function() {
				instructionalSupportStudentFormActionCreators.pretendToastMessage();
			};

			$scope.termShortCodeToTermCode = function(termShortCode) {
				// Already a termCode
				if (termShortCode.length == 6) {
					return termShortCode;
				}
				var year = $scope.year;

				if (["01", "02", "03"].indexOf(termShortCode) >= 0) { year++; }
				var termCode = year + termShortCode;

				return termCode;
			};

			$( "#sortable" ).sortable({
				placeholder: "sortable-student-preference-placeholder",
				update: function( event, ui ) {
					var preferenceIds = $( "#sortable" ).sortable( "toArray" );
					$scope.updatePreferencesOrder(preferenceIds);
				},
				axis: "y"
			});

			$scope.termCode = $scope.termShortCodeToTermCode($routeParams.termShortCode);
	}]);

StudentSupportCallFormCtrl.getPayload = function (authService, instructionalSupportStudentFormActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportStudentFormActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
	});
};