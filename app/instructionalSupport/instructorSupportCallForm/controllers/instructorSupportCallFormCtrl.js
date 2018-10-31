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
    $scope.listenersActive = false;

    $rootScope.$on('instructorFormStateChanged', function (event, data) {
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
      InstructorFormActions.updateSupportCallResponse($scope.view.state.supportCallResponse);
    };

    $scope.submitPreferences = function() {
      $scope.view.state.supportCallResponse.submitted = true;
      InstructorFormActions.submitInstructorPreferences($scope.view.state.supportCallResponse, $scope.workgroupId, $scope.year);
    };

    // Used on 'update preferences' button, since saving is not required again.
    $scope.pretendToastMessage = function() {
      InstructorFormActions.pretendToastMessage();
      $window.location.href = "/summary/" + $scope.workgroupId + "/" + $scope.year + "?mode=instructor";
    };

    $scope.selectCourse = function(tab) {
      InstructorFormActions.selectCourse(tab);
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
      var scheduleId = $scope.view.state.misc.scheduleId;
      InstructorFormActions.updateInstructorPreferencesOrder(filteredPreferenceIds, scheduleId, sectionGroupId);
    };
  }
}

InstructorSupportCallFormCtrl.$inject = ['$scope', '$route', '$rootScope', '$window', '$timeout', '$location', '$routeParams', '$uibModal', 'InstructorFormActions', 'AuthService'];

export default InstructorSupportCallFormCtrl;
