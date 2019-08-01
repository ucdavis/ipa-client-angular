class TaReaderUtilizationReportReducers {
  constructor($rootScope, ActionTypes) {
    return {
      _state: {

      },
      reduce: function(action) {
        var scope = this;

        ActionTypes;
        
        let newState = {};

        scope._state = newState;
        $rootScope.$emit("taReaderUtilizationReportStateChanged", {
          state: scope._state,
          action: action
        });
      }
    };
  }
}

TaReaderUtilizationReportReducers.$inject = ["$rootScope", "ActionTypes"];

export default TaReaderUtilizationReportReducers;
