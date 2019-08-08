import { _array_sortByProperty } from 'shared/helpers/array';

class TaReaderUtilizationReportReducers {
  constructor($rootScope, ActionTypes, DwService, TermService) {
    return {
      _state: {
        budgets: {},
        courses: {},
        sectionGroupCosts: {}
      },
      _budgetReducers: function(action, budget) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_BUDGET:
            return action.payload;
          default:
            return budget;
        }
      },
      _courseReducers: function(action, courses) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_COURSES:
            return action.payload;
          default:
            return courses;
        }
      },
      _sectionGroupCostReducers: function(action, sectionGroupCosts) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS:
            var newState = {
              ids: [],
              list: {}
            };

            for (var i = 0; i < action.payload.length; i++) {
              var sectionGroupCost = action.payload[i];
              newState.ids.push(sectionGroupCost.id);
              newState.list[sectionGroupCost.id] = sectionGroupCost;
            }
            return newState;
          default:
            return sectionGroupCosts;
        }
      },
      _sectionGroupReducers: function(action, sectionGroups) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_SECTION_GROUPS:
            var newState = {
              ids: [],
              list: {}
            };

            for (var i = 0; i < action.payload.length; i++) {
              var sectionGroup = action.payload[i];
              newState.ids.push(sectionGroup.id);
              newState.list[sectionGroup.id] = sectionGroup;
            }
            return newState;
          default:
            return sectionGroups;
        }
      },
      _sectionReducers: function(action, sections) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_SECTIONS:
            var newState = {
              ids: [],
              list: {}
            };

            for (var i = 0; i < action.payload.length; i++) {
              var section = action.payload[i];
              newState.ids.push(section.id);
              newState.list[section.id] = section;
            }
            return newState;
          default:
            return sections;
        }
      },
      _calculationReducers: function(action, calculations) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            calculations = {
              isInitialFetchComplete: false,
              censusDataFetchBegun: false,
              dwCallsOpened: 0,
              dwCallsCompleted: 0
            };
            return calculations;
          case ActionTypes.INITIAL_FETCH_COMPLETE:
            calculations.isInitialFetchComplete =
              action.payload.isInitialFetchComplete;
            return calculations;
          case ActionTypes.BEGIN_CENSUS_DATA_FETCH:
            calculations.censusDataFetchBegun = true;
            return calculations;
          case ActionTypes.CALCULATE_VIEW:
            calculations.calculatedView = action.payload.calculatedView;
            return calculations;
          default:
            return calculations;
        }
      },
      reduce: function(action) {
        var scope = this;

        let newState = {};
        newState.budgets = scope._budgetReducers(action, scope._state.budgets);
        newState.courses = scope._courseReducers(action, scope._state.courses);
        newState.sectionGroupCosts = scope._sectionGroupCostReducers(
          action,
          scope._state.sectionGroupCosts
        );
        newState.sectionGroups = scope._sectionGroupReducers(
          action,
          scope._state.sectionGroups
        );
        newState.sections = scope._sectionReducers(
          action,
          scope._state.sections
        );
        newState.calculations = scope._calculationReducers(
          action,
          scope._state.calculations
        );

        this._calculateView(newState);
        scope._state = newState;

        $rootScope.$emit('taReaderUtilizationReportStateChanged', {
          state: scope._state,
          action: action
        });
      },
      _calculateView: function(state) {
        var budgets = state.budgets;
        var courses = state.courses;
        var sectionGroups = state.sectionGroups;
        var sections = state.sections;

        if (state.calculations.isInitialFetchComplete) {
          sections.ids.forEach(function(sectionId) {
            var section = sections.list[sectionId];
            var sectionGroupId = section.sectionGroupId;
            var sectionGroup = sectionGroups.list[sectionGroupId];
            sectionGroup.sections
              ? sectionGroup.sections.push(section)
              : (sectionGroup.sections = [section]);
          });

          sectionGroups.ids.forEach(function(sectionGroupId) {
            var sectionGroup = sectionGroups.list[sectionGroupId];
            var courseId = sectionGroup.courseId;
            var course = courses.list[courseId];

            sectionGroup.subjectCode = course.subjectCode;
            sectionGroup.courseNumber = course.courseNumber;
            sectionGroup.title = course.title;
            sectionGroup.sequencePattern = course.sequencePattern;

            sectionGroup.taCost =
              sectionGroup.teachingAssistantAppointments * budgets.taCost || 0;
            sectionGroup.readerCost =
              sectionGroup.readerAppointments * budgets.readerCost || 0;

            if (course && course.census.length > 0) {
              var lastOfferedEnrollment = 0;
              var lastOfferedTermCode = '';

              for (var i = course.census.length - 1; i > 0; i--) {
                var slotCensus = course.census[i];

                if (
                  slotCensus.currentEnrolledCount !== 0 &&
                  slotCensus.termCode < parseInt(sectionGroup.termCode) &&
                  TermService.termCodeToTerm(slotCensus.termCode) ==
                    TermService.termCodeToTerm(sectionGroup.termCode)
                ) {
                  lastOfferedEnrollment = slotCensus.currentEnrolledCount;
                  lastOfferedTermCode = slotCensus.termCode.toString();
                  break;
                }
              }
              sectionGroup.lastOfferedEnrollment = lastOfferedEnrollment || 0;
              sectionGroup.lastOfferedTermDescription = TermService.getTermName(
                lastOfferedTermCode,
                true
              );
            }
          });

          sectionGroups.sortedByTerm = {};
          sectionGroups.termDescriptions = {};

          sectionGroups.ids.forEach(function(sectionGroupId) {
            var sectionGroup = sectionGroups.list[sectionGroupId];
            sectionGroups.sortedByTerm[sectionGroup.termCode] = sectionGroups
              .sortedByTerm[sectionGroup.termCode]
              ? [
                  ...sectionGroups.sortedByTerm[sectionGroup.termCode],
                  sectionGroup
                ]
              : [sectionGroup];
          });
         
          for (var term in sectionGroups.sortedByTerm) {
            sectionGroups.termDescriptions[term] = TermService.getTermName(term);

            sectionGroups.sortedByTerm[term] = _array_sortByProperty(
              sectionGroups.sortedByTerm[term],
              'courseNumber'
            );
          }
        }
      }
    };
  }
}

TaReaderUtilizationReportReducers.$inject = [
  '$rootScope',
  'ActionTypes',
  'DwService',
  'TermService'
];

export default TaReaderUtilizationReportReducers;
