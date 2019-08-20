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
            return action.payload.budgets;
          default:
            return budget;
        }
      },
      _courseReducers: function(action, courses) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_COURSES:
            return action.payload.courses;
          default:
            return courses;
        }
      },
      _sectionGroupCostReducers: function(action, sectionGroupCosts) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS:
            return action.payload.sectionGroupCosts;
          default:
            return sectionGroupCosts;
        }
      },
      _sectionGroupReducers: function(action, sectionGroups) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_SECTION_GROUPS:
            return action.payload.sectionGroups;
          default:
            return sectionGroups;
        }
      },
      _sectionReducers: function(action, sections) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            return {};
          case ActionTypes.GET_CURRENT_SECTIONS:
            return action.payload.sections;
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
      _uiReducers: function(action, ui) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            ui = {
              reportViews: [
                {
                  id: 0,
                  description: 'Teaching Assistants'
                },
                {
                  id: 1,
                  description: 'Readers'
                }
              ],
              selectedReport: 'Teaching Assistants'
            };
            return ui;
          case ActionTypes.SELECT_REPORT_VIEW:
            ui.selectedReport = action.payload.description;
            return ui;
          default:
            return ui;
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
        newState.ui = scope._uiReducers(action, scope._state.ui);

        scope._state = newState;

        $rootScope.$emit('taReaderUtilizationReportStateChanged', {
          state: scope._state,
          action: action
        });
      }
    };
  }
}

TaReaderUtilizationReportReducers.$inject = [
  '$rootScope',
  'ActionTypes'
];

export default TaReaderUtilizationReportReducers;
