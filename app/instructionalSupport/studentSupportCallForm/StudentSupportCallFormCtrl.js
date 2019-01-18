import { getRoleDisplayName } from 'shared/helpers/string';

import './studentSupportCallForm.css';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:StudentSupportCallFormCtrl
 * @description
 * # StudentSupportCallFormCtrl
 * Controller of the ipaClientAngularApp
 */
class StudentSupportCallFormCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, StudentFormActions, TermService, AuthService, validate) {
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
		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		$scope.view = {};
	
		$rootScope.$on('studentStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.closeCommentModal = function() {
			StudentFormActions.closePreferenceCommentsModal();
		};

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
	
		$scope.updatePreferencesOrder = function(preferenceIds) {
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

	}
}

StudentSupportCallFormCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'StudentFormActions', 'TermService', 'AuthService', 'validate'];

export default StudentSupportCallFormCtrl;
