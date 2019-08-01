class SupportUtilizationReportReducers {
  constructor($rootScope, ActionTypes) {
    return {
      _state: {

      },
      reduce: function(action) {
        var scope = this;

        ActionTypes;
        
        let newState = {};

        scope._state = newState;
        $rootScope.$emit("supportUtilizationReportStateChanged", {
          state: scope._state,
          action: action
        });
      }
    };
  }
}

SupportUtilizationReportReducers.$inject = ["$rootScope", "ActionTypes"];

export default SupportUtilizationReportReducers;
