import { _array_sortByProperty } from 'shared/helpers/array';

class InstructorFormStateService {
  constructor ($rootScope, $log, InstructorFormSelectors, ActionTypes) {
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.InstructorFormSelectors = InstructorFormSelectors;
    this.ActionTypes = ActionTypes;

    return {
      _state: {},
      _sectionGroupReducers: function (action, sectionGroups) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            sectionGroups = {
              ids: [],
              list: {}
            };

            action.payload.sectionGroups.forEach(function(sectionGroup) {
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
        switch (action.type) {
          case ActionTypes.INIT_STATE:
          courses = {
              ids: [],
              list: {}
            };

            action.payload.courses.forEach(function(course) {
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
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            var sectionGroups = {};

            action.payload.sectionGroups.forEach(function(sectionGroup) {
              sectionGroups[sectionGroup.id] = sectionGroup;
            });

            var allTabs = [];
            var activeSectionGroupId = null;
            var activeSupportStaffId = null;

            action.payload.teachingAssignments.forEach(function(teachingAssignment) {
              if (teachingAssignment.approved && teachingAssignment.sectionGroupId) {
                var sectionGroup = sectionGroups[teachingAssignment.sectionGroupId];
                allTabs.push(sectionGroup);
              }
            });

            allTabs = _array_sortByProperty(allTabs, ["subjectCode", "courseNumber"]);

            activeSectionGroupId = allTabs[0] ? allTabs[0].id : null;

            misc = {
              allTabs: allTabs,
              activeSectionGroupId: activeSectionGroupId,
              activeSupportStaffId: activeSupportStaffId
            };

            misc.scheduleId = action.payload.scheduleId;
            return misc;
            case ActionTypes.SELECT_SECTION_GROUP:
              misc.activeSectionGroupId = action.payload.activeSectionGroupId;
              misc.activeSupportStaffId = null;
              return misc;
            case ActionTypes.SELECT_SUPPORT_STAFF:
              misc.activeSupportStaffId = action.payload.activeSupportStaffId;
              return misc;
          default:
            return misc;
        }
      },
      _supportStaffReducers: function (action, supportStaff) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            supportStaff = {
              ids: [],
              list: {},
              sorted: [],
            };

            action.payload.supportStaffList.forEach(function(slotSupportStaff) {
              supportStaff.ids.push(slotSupportStaff.id);
              supportStaff.list[slotSupportStaff.id] = slotSupportStaff;

              slotSupportStaff.description = slotSupportStaff.fullName;
              supportStaff.sorted.push(slotSupportStaff);
            });

            supportStaff.sorted = _array_sortByProperty(supportStaff.sorted, "lastName");

            return supportStaff;
          default:
            return supportStaff;
        }
      },
      _studentSupportCallResponseReducers: function (action, studentSupportCallResponses) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            studentSupportCallResponses = {
              ids: [],
              list: {},
              array: action.payload.studentSupportCallResponses
            };

            action.payload.studentSupportCallResponses.forEach(function(slotStudentSupportCallResponse) {
              studentSupportCallResponses.ids.push(slotStudentSupportCallResponse.id);
              studentSupportCallResponses.list[slotStudentSupportCallResponse.id] = slotStudentSupportCallResponse;
            });

            return studentSupportCallResponses;
          default:
            return studentSupportCallResponses;
        }
      },
      _teachingAssignmentReducers: function (action, teachingAssignments) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            teachingAssignments = {
              ids: [],
              list: {},
              array: action.payload.teachingAssignments
            };

            action.payload.teachingAssignments.forEach(function(teachingAssignment) {
              teachingAssignments.ids.push(teachingAssignment.id);
              teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
            });

            return teachingAssignments;
          default:
            return teachingAssignments;
        }
      },
      _studentPreferenceReducers: function (action, studentPreferences) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            studentPreferences = {
              ids: [],
              list: {},
              array: action.payload.studentSupportPreferences
            };

            action.payload.studentSupportPreferences.forEach(function(slotStudentPreference) {
              studentPreferences.ids.push(slotStudentPreference.id);
              studentPreferences.list[slotStudentPreference.id] = slotStudentPreference;
            });

            return studentPreferences;
          default:
            return studentPreferences;
        }
      },
      _instructorPreferenceReducers: function (action, instructorPreferences) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            instructorPreferences = {
              ids: [],
              list: {}
            };

            action.payload.instructorSupportPreferences.forEach(function(instructorPreference) {
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
            instructorPreferences.ids.forEach(function(preferenceId) {
              var preference = instructorPreferences.list[preferenceId];
              if (preference.sectionGroupId == action.payload.preference.sectionGroupId && preference.priority > action.payload.preference.priority) {
                preference.priority -= 1;
              }
            });
            return instructorPreferences;
          case ActionTypes.UPDATE_PREFERENCES_ORDER:
            for (var i = 0; i < action.payload.length; i++) {
              var preferenceId = action.payload[i];
              var priority = i + 1;
              instructorPreferences.list[preferenceId].priority = priority;
            }
            return instructorPreferences;
          default:
            return instructorPreferences;
        }
      },
      _instructorSupportCallResponseReducers: function (action, instructorSupportCallResponse) {
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
        newState.studentSupportCallResponses = scope._studentSupportCallResponseReducers(action, scope._state.studentSupportCallResponses);
        newState.studentPreferences = scope._studentPreferenceReducers(action, scope._state.studentPreferences);
        newState.instructorPreferences = scope._instructorPreferenceReducers(action, scope._state.instructorPreferences);
        newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
        scope._state = newState;

        // Build new 'page state'
        // This is the 'view friendly' version of the store
        let newPageState = {};

        newPageState.supportStaff = angular.copy(newState.supportStaff); // eslint-disable-line no-undef
        newPageState.instructorSupportCallResponse = angular.copy(scope._state.instructorSupportCallResponse); // eslint-disable-line no-undef
        newPageState.studentSupportCallResponses = angular.copy(scope._state.studentSupportCallResponses); // eslint-disable-line no-undef
        newPageState.studentPreferences = angular.copy(scope._state.studentPreferences); // eslint-disable-line no-undef
        newPageState.misc = angular.copy(scope._state.misc); // eslint-disable-line no-undef
        newPageState.teachingAssignments = newState.teachingAssignments;
        newPageState.courses = newState.courses;
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
