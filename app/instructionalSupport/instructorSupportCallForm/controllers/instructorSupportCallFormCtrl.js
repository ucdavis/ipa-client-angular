import './../instructorSupportCallForm.css';
import './../instructorComment.css';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:InstructorSupportCallFormCtrl
 * @description
 * # InstructorSupportCallFormApp
 * Controller of the ipaClientAngularApp
 */
class InstructorSupportCallFormCtrl {
  constructor ($scope, $route, $rootScope, $window, $timeout, $location, $routeParams, $uibModal, InstructorFormActions, AuthService) {
    this.$scope = $scope;
    this.$route = $route;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.$uibModal = $uibModal;
    this.InstructorFormActions = InstructorFormActions;
    this.AuthService = AuthService;

    $scope.view = {};

    $window.document.title = "Instructional Support";
    $scope.workgroupId = $routeParams.workgroupId;
    $scope.year = $routeParams.year;
    $scope.termShortCode = $routeParams.termShortCode;

    $scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);

    $scope.instructorCourses = [];

    $rootScope.$on('instructorFormStateChanged', function (event, data) {
      $scope.activeSectionGroup = data.sectionGroups.list[data.misc.activeSectionGroupId];
      $scope.view.state = data;
      console.log(data);
    });

    $rootScope.$on('sharedStateSet', function (event, data) {
      $scope.sharedState = data;
      $scope.isInstructor = $scope.sharedState.currentUser.isInstructor($scope.workgroupId);
    });

    $scope.addPreference = function(sectionGroupId, supportStaffId) {
      InstructorFormActions.addInstructorPreference(sectionGroupId, supportStaffId);
    };

    $scope.deleteInstructorPreference = function(preference) {
      InstructorFormActions.deleteInstructorPreference(preference, $scope.view.state.studentPreferences);
    };

    $scope.updateSupportCallResponse = function() {
      InstructorFormActions.updateSupportCallResponse($scope.view.state.instructorSupportCallResponse);
    };

    $scope.submitPreferences = function() {
      $scope.view.state.instructorSupportCallResponse.submitted = true;
      InstructorFormActions.submitInstructorPreferences($scope.view.state.instructorSupportCallResponse, $scope.workgroupId, $scope.year);
    };

    // Used on 'update preferences' button, since saving is not required again.
    $scope.pretendToastMessage = function() {
      InstructorFormActions.pretendToastMessage();
      $window.location.href = "/summary/" + $scope.workgroupId + "/" + $scope.year + "?mode=instructor";
    };

    $scope.selectSectionGroup = function(sectionGroup) {
      InstructorFormActions.selectSectionGroup(sectionGroup);
    };

    $scope.updatePreferencesOrder = function(preferenceIds, listIndentifier) {
      var filteredPreferenceIds = [];

      preferenceIds.forEach(function(id) {
        if (id.length > 0) {
          filteredPreferenceIds.push(id);
        }
      });

      var sectionGroupId = listIndentifier.slice(10);
      var scheduleId = $scope.view.state.misc.scheduleId;
      InstructorFormActions.updateInstructorPreferencesOrder(filteredPreferenceIds, scheduleId, sectionGroupId);
    };
  }
}

InstructorSupportCallFormCtrl.$inject = ['$scope', '$route', '$rootScope', '$window', '$timeout', '$location', '$routeParams', '$uibModal', 'InstructorFormActions', 'AuthService'];

export default InstructorSupportCallFormCtrl;
