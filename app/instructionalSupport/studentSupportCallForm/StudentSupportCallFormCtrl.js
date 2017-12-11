/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('StudentSupportCallFormCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'studentActions',
this.StudentSupportCallFormCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, studentActions) {
	$window.document.title = "Instructional Support";
	$scope.workgroupId = $routeParams.workgroupId;
	$scope.year = $routeParams.year;
	$scope.termShortCode = $routeParams.termShortCode;
	$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);

	$scope.view = {};

	$rootScope.$on('studentStateChanged', function (event, data) {
		$scope.view.state = data;
	});

	$scope.updatePreferencesOrder = function(preferenceIds) {
		studentActions.updatePreferencesOrder(preferenceIds, $scope.view.state.userInterface.scheduleId, $scope.termCode);
	};

	$scope.pretendToastMessage = function() {
		studentActions.pretendToastMessage();
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

	$scope.updatePreferencesOrder = function(preferenceIds, listIndentifier) {
		var filteredPreferenceIds = [];

		preferenceIds.forEach(function(id) {
			if (id.length > 0) {
				filteredPreferenceIds.push(id);
			}
		});

		var scheduleId = $scope.view.state.misc.scheduleId;
		studentActions.updatePreferencesOrder(filteredPreferenceIds, scheduleId, $scope.termCode);
	};

	$scope.getRoleDisplayName = function (roleString) {
		return getRoleDisplayName(roleString);
	};

	$scope.termCode = $scope.termShortCodeToTermCode($scope.termShortCode);

	$scope.studentSupportCallFormIsValid = function () {
		// Validate dueDate
		if ($scope.view.state.ui.isFormLocked) {
			$scope.validationError = "The due date for this support call has passed.";
			return false;
		}

		// Validate min # of preferences
		var currentNumPreferences = $scope.view.state.preferences.length;
		var minNumPreferences = 0;

		if ($scope.view.state.supportCallResponse) {
			minNumPreferences = $scope.view.state.supportCallResponse.minimumNumberOfPreferences;
		}

		if (currentNumPreferences < minNumPreferences) {
			$scope.validationError = "You must provide at least " + minNumPreferences + " preferences";
			return false;
		}

		if ($scope.view.state.supportCallResponse.requirePreferenceComments == true) {
			for (var i = 0; i < $scope.view.state.preferences.length; i++) {
				var preference = $scope.view.state.preferences[i];

				if (preference.comment.length == 0) {
					$scope.validationError = "You must provide a comment for each preference";
					return false;
				}
			}
		}

		$scope.validationError = "";
		return true;
	};
}]);

StudentSupportCallFormCtrl.getPayload = function (authService, studentActions, $route, $window) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		// validate params
		if ($route.current.params.year.length != 4 || $route.current.params.termShortCode.length != 2) {
			$window.location.href = "/summary/" + $route.current.params.workgroupId + "/" + $route.current.params.year + "?mode=instructionalSupport";
		} else {
			studentActions.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
		}
	});
};