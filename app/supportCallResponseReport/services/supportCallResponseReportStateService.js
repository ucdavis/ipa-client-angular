class SupportCallResponseReportStateService {
  constructor(
    $rootScope,
    $log,
    Term,
    SectionGroup,
    ActionTypes,
    AvailabilityService
  ) {
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.Term = Term;
    this.SectionGroup = SectionGroup;
    this.ActionTypes = ActionTypes;

    return {
      _state: {},
      _coursesReducers: function (action, courses) {
        switch (action.type) {
          case ActionTypes.INIT_STATE: {
            let coursesById = action.payload.courses.reduce(
              (dictionary, course) => {
                dictionary[course.id] = course;
                return dictionary;
              },
              {}
            );
            return coursesById;
          }
          default:
            return courses;
        }
      },
      _sectionGroupsReducers: function (action, sectionGroups) {
        switch (action.type) {
          case ActionTypes.INIT_STATE: {
            let sectionGroupsById = action.payload.sectionGroups.reduce(
              (dictionary, sectionGroup) => {
                dictionary[sectionGroup.id] = sectionGroup;
                return dictionary;
              },
              {}
            );
            return sectionGroupsById;
          }
          default:
            return sectionGroups;
        }
      },
      _studentSupportCallResponsesReducers: function (
        action,
        supportCallResponses
      ) {
        switch (action.type) {
          case ActionTypes.INIT_STATE: {
            supportCallResponses = action.payload.studentSupportCallResponses;
            action.payload.studentSupportPreferences;
            return supportCallResponses;
          }
          default:
            return supportCallResponses;
        }
      },
      // _studentSupportPreferencesReducers: function (
      //   action,
      //   studentSupportPreferences
      // ) {
      //   switch (action.type) {
      //     case ActionTypes.INIT_STATE: {
      //       studentSupportPreferences =
      //         action.payload.studentSupportPreferences;
      //       action.payload.studentSupportPreferences;
      //       return studentSupportPreferences;
      //     }
      //     default:
      //       return studentSupportPreferences;
      //   }
      // },
      _supportStaffReducers: function (action, supportStaff) {
        switch (action.type) {
          case ActionTypes.INIT_STATE: {
            supportStaff = action.payload.supportStaffList;

            supportStaff.map((supportStaff) => {
              supportStaff.supportCallResponse = action.payload.studentSupportCallResponses.find(
                (response) => response.supportStaffId === supportStaff.id
              );
              supportStaff.preferences = action.payload.studentSupportPreferences
                .filter(
                  (preference) => preference.supportStaffId === supportStaff.id
                )
                .sort((a, b) => {
                  return a.priority - b.priority;
                });
              supportStaff.availabilities = supportStaff.supportCallResponse
                ? AvailabilityService.availabilityBlobToDescriptions(
                    supportStaff.supportCallResponse.availabilityBlob
                  )
                : [];
            });
            console.log(supportStaff.filter((ss) => ss.lastName === 'Abbott'));

            return supportStaff;
          }
          default:
            return supportStaff;
        }
      },
      _uiReducers: function (action, ui) {
        switch (action.type) {
          case ActionTypes.INIT_STATE: {
            let sampleResponse = action.payload.studentSupportCallResponses[0];
            let ui = {
              showAvailabilities: false,
              showEligibilityConfirmation: false,
              showGeneralComments: false,
              showLanguageProficiencies: false,
              showTeachingQualifications: false,
              showPreferences: false,
            };

            if (sampleResponse) {
              ui = {
                showAvailabilities:
                  sampleResponse.collectAvailabilityByCrn ||
                  sampleResponse.collectAvailabilityByGrid,
                showEligibilityConfirmation:
                  sampleResponse.collectEligibilityConfirmation,
                showGeneralComments: sampleResponse.collectGeneralComments,
                showLanguageProficiencies:
                  sampleResponse.collectLanguageProficiencies,
                showTeachingQualifications:
                  sampleResponse.collectTeachingQualifications,
                showPreferences:
                  sampleResponse.collectAssociateInstructorPreferences ||
                  sampleResponse.collectTeachingAssistantPreferences ||
                  sampleResponse.collectReaderPreferences,
              };
            }

            return ui;
          }
          default:
            return ui;
        }
      },
      reduce: function (action) {
        var scope = this;

        if (!action || !action.type) {
          return;
        }

        scope._state = {
          courses: scope._coursesReducers(action, scope._state.courses),
          sectionGroups: scope._sectionGroupsReducers(
            action,
            scope._state.sectionGroups
          ),
          supportCallResponses: scope._studentSupportCallResponsesReducers(
            action,
            scope._state.supportCallResponses
          ),
          supportStaff: scope._supportStaffReducers(
            action,
            scope._state.supportStaff
          ),
          ui: scope._uiReducers(action, scope._state.ui),
        };

        $rootScope.$emit('reportStateChanged', {
          state: scope._state,
          action: action,
        });
      },
    };
  }
}

SupportCallResponseReportStateService.$inject = [
  '$rootScope',
  '$log',
  'Term',
  'SectionGroup',
  'ActionTypes',
  'AvailabilityService',
];

export default SupportCallResponseReportStateService;
