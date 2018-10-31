
class InstructorFormActions {
  constructor ($rootScope, $window, $route, InstructorFormService, InstructorFormStateService, ActionTypes) {
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.InstructorFormService = InstructorFormService;
    this.InstructorFormStateService = InstructorFormStateService;
    this.ActionTypes = ActionTypes;

    return {
      getInitialState: function () {
        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;
        var termShortCode = $route.current.params.termShortCode;

        InstructorFormService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
          var action = {
            type: ActionTypes.INIT_STATE,
            payload: payload,
            year: year
          };
          InstructorFormStateService.reduce(action);
        }, function (err) {
          $rootScope.$emit('toast', { message: "Could not load instructional support initial state.", type: "ERROR" });
        });
      },
      selectCourse: function (tab) {
        InstructorFormStateService.reduce({
          type: ActionTypes.SELECT_COURSE,
          payload:  {
            activeTab: tab
          }
        });
      },
      addInstructorPreference: function (sectionGroupId, supportStaffId) {
        InstructorFormService.addInstructorPreference(sectionGroupId, supportStaffId).then(function (newPreference) {
          $rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
          var action = {
            type: ActionTypes.ADD_INSTRUCTOR_PREFERENCE,
            payload:  {
              newPreference: newPreference
            }
          };
          InstructorFormStateService.reduce(action);
        }, function (err) {
          $rootScope.$emit('toast', { message: "Could not add instructor preference.", type: "ERROR" });
        });
      },
      updateSupportCallResponse: function (supportCallResponse) {
        InstructorFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
          $rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
          var action = {
            type: ActionTypes.UPDATE_SUPPORT_CALL_RESPONSE,
            payload: payload
          };
          InstructorFormStateService.reduce(action);
        }, function (err) {
          $rootScope.$emit('toast', { message: "Could not update preference.", type: "ERROR" });
        });
      },
      deleteInstructorPreference: function (preference, studentPreferences) {
        InstructorFormService.deleteInstructorPreference(preference.id).then(function (payload) {
          $rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
          var action = {
            type: ActionTypes.DELETE_INSTRUCTOR_PREFERENCE,
            payload: {
              preference: preference,
              studentPreferences: studentPreferences
            }
          };
          InstructorFormStateService.reduce(action);
        }, function (err) {
          $rootScope.$emit('toast', { message: "Could not remove preference.", type: "ERROR" });
        });
      },
      submitInstructorPreferences: function (supportCallResponse, workgroupId, year) {
        InstructorFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
          $rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });

          var instructorSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructor";
          $window.location.href = instructorSummaryUrl;
        }, function (err) {
          $rootScope.$emit('toast', { message: "Could not update preference.", type: "ERROR" });
        });
      },
      updateInstructorPreferencesOrder: function (preferenceIds, scheduleId, sectionGroupId) {
        InstructorFormService.updatePreferencesOrder(preferenceIds, scheduleId, sectionGroupId).then(function (payload) {
          $rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
          var action = {
            type: ActionTypes.UPDATE_PREFERENCES_ORDER,
            payload: payload
          };
          InstructorFormStateService.reduce(action);
        }, function (err) {
          $rootScope.$emit('toast', { message: "Could not update preference order.", type: "ERROR" });
        });
      },
      pretendToastMessage: function () {
        $rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
      }
    };
  }
}

InstructorFormActions.$inject = ['$rootScope', '$window', '$route', 'InstructorFormService', 'InstructorFormStateService', 'ActionTypes'];

export default InstructorFormActions;
