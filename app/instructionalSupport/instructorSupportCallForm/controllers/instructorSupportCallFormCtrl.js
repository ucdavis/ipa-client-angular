/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructorSupportCallFormCtrl', ['$scope', '$route', '$rootScope', '$window', '$timeout', '$location', '$routeParams', '$uibModal', 'instructionalSupportInstructorFormActionCreators',
		this.InstructorSupportCallFormCtrl = function ($scope, $route, $rootScope, $window, $timeout, $location, $routeParams, $uibModal, instructionalSupportInstructorFormActionCreators) {
			$scope.view = {};

			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termShortCode = $routeParams.termShortCode;

			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.listenersActive = false;

			$rootScope.$on('instructorFormStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$rootScope.$on('sharedStateSet', function (event, data) {
				$scope.sharedState = data;
				$scope.isInstructor = $scope.sharedState.currentUser.isInstructor($scope.workgroupId);
			});

			$scope.addPreference = function(sectionGroupId, supportStaffId) {
				instructionalSupportInstructorFormActionCreators.addInstructorPreference(sectionGroupId, supportStaffId);
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

			// Activates sortable lists for each sectionGroup, after a short delay to give the view time to render
			$scope.listenForSort = function() {
				if ($scope.listenersActive) {
					return;
				}
				$scope.listenersActive = true;

				setTimeout(function() {
					var listenerIds = [];
					$scope.view.state.sectionGroups.forEach(function(sectionGroup) {
						var listener = "#sortable-" + sectionGroup.id;
						listenerIds.push(listener);
					});

					listenerIds.forEach( function(listenerId) {
						$(listenerId).sortable({
							placeholder: "sortable-student-preference-placeholder",
							update: function( event, ui ) {
								var preferenceIds = $( listenerId ).sortable( "toArray" );
								$scope.updatePreferencesOrder(preferenceIds, listenerId);
							},
							axis: "y"
						});
					});
				}, 500);
			};

			$scope.updatePreferencesOrder = function(preferenceIds, listIndentifier) {
				var filteredPreferenceIds = [];

				preferenceIds.forEach(function(id) {
					if (id.length > 0) {
						filteredPreferenceIds.push(id);
					}
				});

				var sectionGroupId = listIndentifier.slice(10);
				var scheduleId = $scope.view.state.userInterface.scheduleId;
				instructionalSupportInstructorFormActionCreators.updateInstructorPreferencesOrder(filteredPreferenceIds, scheduleId, sectionGroupId);
			};
	}]);

InstructorSupportCallFormCtrl.getPayload = function (authService, instructionalSupportInstructorFormActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportInstructorFormActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
	});
};