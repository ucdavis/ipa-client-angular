/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('StudentSupportCallFormCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'supportStaffFormActionCreators',
		this.StudentSupportCallFormCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, supportStaffFormActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termShortCode = $routeParams.termShortCode;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};
			$scope.listenersActive = false;

			$rootScope.$on('supportStaffFormStateChanged', function (event, data) {
				$scope.view.state = data;
				$scope.listenForSort();
			});

			$scope.toggleEligibilityConfirmed = function() {
				if ($scope.view.state.supportCallResponse.eligibilityConfirmed) {
					$scope.view.state.supportCallResponse.eligibilityConfirmed = false;
				} else {
					$scope.view.state.supportCallResponse.eligibilityConfirmed = true;
				}

				supportStaffFormActionCreators.updateSupportCallResponse($scope.view.state.supportCallResponse);
			};

			$scope.addPreference = function(preference) {
				supportStaffFormActionCreators.addStudentPreference(preference);
			};

			$scope.deletePreference = function(preference) {
				supportStaffFormActionCreators.deleteStudentPreference(preference);
			};

			$scope.updateSupportCallResponse = function() {
				supportStaffFormActionCreators.updateSupportCallResponse($scope.view.state.supportCallResponse);
			};

			$scope.submitPreferences = function() {
				$scope.view.state.supportCallResponse.submitted = true;
				supportStaffFormActionCreators.submitPreferences($scope.view.state.supportCallResponse, $scope.workgroupId, $scope.year);
			};

			$scope.updatePreferencesOrder = function(preferenceIds) {
				supportStaffFormActionCreators.updatePreferencesOrder(preferenceIds, $scope.view.state.userInterface.scheduleId, $scope.termCode);
			};

			$scope.pretendToastMessage = function() {
				supportStaffFormActionCreators.pretendToastMessage();
				$window.location.href = "/summary/" + $scope.workgroupId + "/" + $scope.year + "?mode=instructionalSupport";
			};

			$scope.openPreferenceCommentModal = function(preference) {
				modalInstance = $uibModal.open({
					templateUrl: 'ModalPreferenceComment.html',
					controller: ModalPreferenceCommentCtrl,
					size: 'lg',
					resolve: {
						preference: function () {
							return preference;
						},
						state: function () {
							return $scope.view.state;
						}
					}
				});
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

			// Activates sortable lists for each sectionGroup, after a short delay to give the view time to render
			$scope.listenForSort = function() {
				if ($scope.listenersActive) {
					return;
				}
				$scope.listenersActive = true;

				setTimeout(function() {
					var listenerIds = [];
					var listener = "#sortable";
					listenerIds.push(listener);

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

				var scheduleId = $scope.view.state.misc.scheduleId;
				supportStaffFormActionCreators.updatePreferencesOrder(filteredPreferenceIds, scheduleId, $scope.termCode);
			};

			$scope.getRoleDisplayName = function (roleString) {
				return getRoleDisplayName(roleString);
			};

			$scope.termCode = $scope.termShortCodeToTermCode($scope.termShortCode);
	
			// Form locks when a due date has been set, and has passed
			$scope.isFormLocked = function () {
				// Validate dueDate
				var dueDate = $scope.view.state.supportCallResponse.dueDate;
				if (dueDate) {
					var date = new Date();
					var currentTime = date.getTime();

					if (currentTime > dueDate) {
						return true;
					}
				}

				return false
			};

			$scope.studentSupportCallFormIsValid = function () {
				// Validate dueDate
				if ( $scope.isFormLocked() ) {
					$scope.validationError = "The due date for this support call has passed.";
					return false;
				}

				// Validate min # of preferences
				var currentNumPreferences = $scope.view.state.preferences.length;
				var minNumPreferences = $scope.view.state.supportCallResponse.minimumNumberOfPreferences;

				if (currentNumPreferences < minNumPreferences) {
					$scope.validationError = "You must provide at least " + minNumPreferences + " preferences";
					return false;
				}

				$scope.validationError = "";
				return true;
			};
	}]);

StudentSupportCallFormCtrl.getPayload = function (authService, supportStaffFormActionCreators, $route, $window) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		// validate params
		if ($route.current.params.year.length != 4 || $route.current.params.termShortCode.length != 2) {
			$window.location.href = "/summary/" + $route.current.params.workgroupId + "/" + $route.current.params.year + "?mode=instructionalSupport";
		} else {
			supportStaffFormActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
		}
	});
};