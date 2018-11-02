class InstructorFormStateService {
  constructor ($rootScope, $log, InstructorFormSelectors, ActionTypes) {
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.InstructorFormSelectors = InstructorFormSelectors;
    this.ActionTypes = ActionTypes;

    return {
      _state: {},
      _sectionGroupReducers: function (action, sectionGroups) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
            sectionGroups = {
              ids: [],
              list: {}
            };

            action.payload.sectionGroups.forEach( function(sectionGroup) {
              // Record to state
              sectionGroups.ids.push(sectionGroup.id);
              sectionGroups.list[sectionGroup.id] = sectionGroup;
            });

            return sectionGroups;
          default:
            return sectionGroups;
        }
      },
      _courseReducers: function (action, courses) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
          courses = {
              ids: [],
              list: {}
            };

            action.payload.courses.forEach( function(course) {
              // Record to state
              courses.ids.push(course.id);
              courses.list[course.id] = course;
            });

            return courses;
          default:
            return courses;
        }
      },
      _miscReducers: function (action, misc) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
            var courses = {};
            action.payload.courses.forEach(function(course) {
              courses[course.id] = course;
            });

            var allTabs = action.payload.sectionGroups.map(function(sectionGroup) {
              var course = courses[sectionGroup.courseId];
              return course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern;
            });

            var activeCourseId = action.payload.courses.length > 0 ? action.payload.courses[0].id : null;
            var activeSectionGroupId = null;

            if (activeCourseId) {
              action.payload.sectionGroups.forEach(function(sectionGroup) {
                if (sectionGroup.courseId == activeCourseId) {
                  activeSectionGroupId = sectionGroup.id;
                }
              });
            }

            misc = {
              allTabs: allTabs,
              activeTab: allTabs.length > 0 ? allTabs[0] : null,
              activeSectionGroupId: activeSectionGroupId
            };

            misc.scheduleId = action.payload.scheduleId;
            return misc;
            case ActionTypes.SELECT_COURSE:
              misc.activeTab = action.payload.activeTab;
              misc.activeSectionGroupId = action.payload.activeSectionGroupId
              return misc;
          default:
            return misc;
        }
      },
      _supportStaffReducers: function (action, supportStaff) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
            supportStaff = {
              ids: [],
              list: {}
            };

            action.payload.supportStaffList.forEach( function(slotSupportStaff) {
              supportStaff.ids.push(slotSupportStaff.id);
              supportStaff.list[slotSupportStaff.id] = slotSupportStaff;
            });

            return supportStaff;
          default:
            return supportStaff;
        }
      },
      _studentPreferenceReducers: function (action, studentPreferences) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
            studentPreferences = {
              ids: [],
              list: {}
            };

            action.payload.studentSupportPreferences.forEach( function(slotStudentPreference) {
              studentPreferences.ids.push(slotStudentPreference.id);
              studentPreferences.list[slotStudentPreference.id] = slotStudentPreference;
            });

            return studentPreferences;
          default:
            return studentPreferences;
        }
      },
      _instructorPreferenceReducers: function (action, instructorPreferences) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
            instructorPreferences = {
              ids: [],
              list: {}
            };

            action.payload.instructorSupportPreferences.forEach( function(instructorPreference) {
              instructorPreferences.ids.push(instructorPreference.id);
              instructorPreferences.list[instructorPreference.id] = instructorPreference;
            });

            return instructorPreferences;
          case ActionTypes.ADD_INSTRUCTOR_PREFERENCE:
            var preference = action.payload.newPreference;
            instructorPreferences.ids.push(preference.id);
            instructorPreferences.list[preference.id] = preference;
            return instructorPreferences;
          case ActionTypes.DELETE_INSTRUCTOR_PREFERENCE:
            var preferenceId = action.payload.preference.id;
            var index = instructorPreferences.ids.indexOf(preferenceId);

            instructorPreferences.ids.splice(index, 1);
            return instructorPreferences;
          default:
            return instructorPreferences;
        }
      },
      _instructorSupportCallResponseReducers: function (action, instructorSupportCallResponse) {
        var scope = this;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
            instructorSupportCallResponse = action.payload.instructorSupportCallResponse;
            return instructorSupportCallResponse;
          case ActionTypes.UPDATE_SUPPORT_CALL_RESPONSE:
            instructorSupportCallResponse = action.payload;
            return instructorSupportCallResponse;
          default:
            return instructorSupportCallResponse;
        }
      },
      reduce: function (action) {
        var scope = this;

        let newState = {};
        newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
        newState.courses = scope._courseReducers(action, scope._state.courses);
        newState.supportStaff = scope._supportStaffReducers(action, scope._state.supportStaff);
        newState.misc = scope._miscReducers(action, scope._state.misc);
        newState.instructorSupportCallResponse = scope._instructorSupportCallResponseReducers(action, scope._state.instructorSupportCallResponse);
        newState.studentPreferences = scope._studentPreferenceReducers(action, scope._state.studentPreferences);
        newState.instructorPreferences = scope._instructorPreferenceReducers(action, scope._state.instructorPreferences);

        scope._state = newState;

        // Build new 'page state'
        // This is the 'view friendly' version of the store
        let newPageState = {};

        newPageState.instructorSupportCallResponse = angular.copy(scope._state.instructorSupportCallResponse);
        newPageState.studentSupportCallResponses = angular.copy(action.payload.studentSupportCallResponses);
        newPageState.studentPreferences = angular.copy(scope._state.studentPreferences);
        newPageState.misc = angular.copy(scope._state.misc);
        newPageState.sectionGroups = InstructorFormSelectors.generateSectionGroups(
                                                                              scope._state.sectionGroups,
                                                                              scope._state.supportStaff,
                                                                              scope._state.studentPreferences,
                                                                              scope._state.instructorPreferences,
                                                                              scope._state.courses
                                                                            );

        $rootScope.$emit('instructorFormStateChanged', newPageState);
      }
    };
  }
}

InstructorFormStateService.$inject = ['$rootScope', '$log', 'InstructorFormSelectors', 'ActionTypes'];

export default InstructorFormStateService;
