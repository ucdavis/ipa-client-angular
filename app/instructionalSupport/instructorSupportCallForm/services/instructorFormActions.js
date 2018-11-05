
class InstructorFormActions {
  constructor ($rootScope, $window, $route, InstructorFormService, InstructorFormStateService, ActionTypes) {
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.InstructorFormService = InstructorFormService;
    this.InstructorFormStateService = InstructorFormStateService;
    this.ActionTypes = ActionTypes;

    return {
      getInitialState: function () {
        var _this = this;

        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;
        var termShortCode = $route.current.params.termShortCode;

        InstructorFormService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
          _this.addCourseDataToSectionGroups(payload.courses, payload.sectionGroups);

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
      // Blend the relevant course data into the sectionGroup
      addCourseDataToSectionGroups: function (courses, sectionGroups) {
        sectionGroups.forEach(function(sectionGroup) {
          courses.forEach( function (course) {
    
            if (sectionGroup.courseId == course.id) {
              sectionGroup.subjectCode = course.subjectCode;
              sectionGroup.sequencePattern = course.sequencePattern;
              sectionGroup.courseNumber = course.courseNumber;
              sectionGroup.title = course.title;
              sectionGroup.units = course.unitsLow;
            }
          });
        });
      },
      selectCourse: function (tab) {
        var sectionGroups = InstructorFormStateService._state.sectionGroups;
        var courses = InstructorFormStateService._state.courses;

        var activeCourseId = null;
        courses.ids.forEach(function(courseId) {
          var course = courses.list[courseId];
          var courseKey = course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern;
          if (courseKey == tab) {
            activeCourseId = course.id;
          }
        });

        var activeSectionGroupId = null;
        sectionGroups.ids.forEach(function(sectionGroupId) {
          var sectionGroup = sectionGroups.list[sectionGroupId];
          if (sectionGroup.courseId == activeCourseId) {
            activeSectionGroupId = sectionGroup.id;
          }
        });

        InstructorFormStateService.reduce({
          type: ActionTypes.SELECT_COURSE,
          payload:  {
            activeTab: tab,
            activeSectionGroupId: activeSectionGroupId
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
      updateSupportCallResponse: function (instructorSupportCallResponse) {
        InstructorFormService.updateSupportCallResponse(instructorSupportCallResponse).then(function (payload) {
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
      deleteInstructorPreference: function (preference) {
        var studentPreferences = InstructorFormStateService._state.studentPreferences;

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
      submitInstructorPreferences: function (instructorSupportCallResponse, workgroupId, year) {
        InstructorFormService.updateSupportCallResponse(instructorSupportCallResponse).then(function (payload) {
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
