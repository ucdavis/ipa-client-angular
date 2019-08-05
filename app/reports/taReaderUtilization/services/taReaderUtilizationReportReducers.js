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
            var newState = { ids: [], list: {} };

            for (var i = 0; i < action.payload.length; i++) {
              var course = action.payload[i];
              newState.ids.push(course.id);
              newState.list[course.id] = course;
            }
            return newState;
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
              var sectionGroupCosts = action.payload[i];
              newState.ids.push(sectionGroupCosts.id);
              newState.list[sectionGroupCosts.id] = sectionGroupCosts;
            }
            return newState;
          default:
            return sectionGroupCosts;
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

        scope._state = newState;
        // debugger;
        $rootScope.$emit('taReaderUtilizationReportStateChanged', {
          state: scope._state,
          action: action
        });
      }
    };
  }
}

TaReaderUtilizationReportReducers.$inject = ['$rootScope', 'ActionTypes'];

export default TaReaderUtilizationReportReducers;
