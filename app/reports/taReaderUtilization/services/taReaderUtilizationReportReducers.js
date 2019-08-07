import { _array_sortByProperty } from 'shared/helpers/array';

class TaReaderUtilizationReportReducers {
  constructor($rootScope, ActionTypes) {
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
            var newState = { ids: [], list: {} };

            for (var i = 0; i < action.payload.length; i++) {
              var course = action.payload[i];
              newState.ids.push(course.id);
              newState.list[course.id] = course;
            }
            return newState;
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
      reduce: function(action) {
        var scope = this;

        let newState = {};
        newState.budgets = scope._budgetReducers(action, scope._state.budgets);
        newState.courses = scope._courseReducers(action, scope._state.courses);
        newState.sectionGroupCosts = scope._sectionGroupCostReducers(
          action,
          scope._state.sectionGroupCosts
        );
        newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
        newState.sections = scope._sectionReducers(action, scope._state.sections);

        this._calculateView(newState);
        scope._state = newState;
        // debugger;
        $rootScope.$emit('taReaderUtilizationReportStateChanged', {
          state: scope._state,
          action: action
        });
      },
      _calculateView: function(state) {
        var courses = state.courses;
        var sectionGroups = state.sectionGroups;
        var sections = state.sections;

        var fetchComplete = Object.keys(sectionGroups).length > 0 && Object.keys(sections).length > 0;

        if (fetchComplete) {
          sections.ids.forEach(function(sectionId) {
            var section = sections.list[sectionId];
            var sectionGroupId = section.sectionGroupId;
            var sectionGroup = sectionGroups.list[sectionGroupId];
            sectionGroup.sections ? sectionGroup.sections.push(section) : sectionGroup.sections = [section];
          });

          sectionGroups.ids.forEach(function(sectionGroupId) {
            var sectionGroup = sectionGroups.list[sectionGroupId];
            var courseId = sectionGroup.courseId;
            var course = courses.list[courseId];

            sectionGroup.subjectCode = course.subjectCode;
            sectionGroup.courseNumber = course.courseNumber;
            sectionGroup.title = course.title;
            sectionGroup.sequencePattern = course.sequencePattern;
            
          });

          debugger;
          sectionGroups.ids = _array_sortByProperty(sectionGroups.list, "courseNumber").map(function(sectionGroup) { return sectionGroup.id });
        }
      }
    };
  }
}

TaReaderUtilizationReportReducers.$inject = ['$rootScope', 'ActionTypes'];

export default TaReaderUtilizationReportReducers;
