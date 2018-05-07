import './studentSupportCallForm.css';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:StudentSupportCallFormCtrl
 * @description
 * # StudentSupportCallFormCtrl
 * Controller of the ipaClientAngularApp
 */
class StudentSupportCallFormCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, StudentFormActions, TermService, AuthService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.StudentFormActions = StudentFormActions;
		this.TermService = TermService;
		this.AuthService = AuthService;
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
			StudentFormActions.updatePreferencesOrder(preferenceIds, $scope.view.state.userInterface.scheduleId, $scope.termCode);
		};
	
		$scope.pretendToastMessage = function() {
			StudentFormActions.pretendToastMessage();
			$window.location.href = "/summary/" + $scope.workgroupId + "/" + $scope.year + "?mode=instructionalSupport";
		};
	
		$scope.termShortCodeToTermCode = function(term) {
			return TermService.termToTermCode(term, $scope.year);
		};
	
		$scope.updatePreferencesOrder = function(preferenceIds, listIndentifier) {
			var filteredPreferenceIds = [];
	
			preferenceIds.forEach(function(id) {
				if (id.length > 0) {
					filteredPreferenceIds.push(id);
				}
			});
	
			var scheduleId = $scope.view.state.misc.scheduleId;
			StudentFormActions.updatePreferencesOrder(filteredPreferenceIds, scheduleId, $scope.termCode);
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
			var minNumPreferences = $scope.view.state.supportCallResponse ? $scope.view.state.supportCallResponse.minimumNumberOfPreferences : 0;
	
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

		this.getPayload();
	}

	getPayload () {
		var _self = this;
		this.AuthService.validate(localStorage.getItem('JWT'), _self.$route.current.params.workgroupId, _self.$route.current.params.year).then(function () {
			// validate params
			if (_self.$route.current.params.year.length != 4 || _self.$route.current.params.termShortCode.length != 2) {
				_self.$window.location.href = "/summary/" + _self.$route.current.params.workgroupId + "/" + _self.$route.current.params.year + "?mode=instructionalSupport";
			} else {
				_self.StudentFormActions.getInitialState(_self.$route.current.params.workgroupId, _self.$route.current.params.year, _self.$route.current.params.termShortCode);
			}
		});
	}
}

StudentSupportCallFormCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'StudentFormActions', 'TermService', 'AuthService'];

export default StudentSupportCallFormCtrl;
