class TaReaderUtilizationReportActions {
  constructor(
    TaReaderUtilizationReportReducers,
    TaReaderUtilizationReportService,
    $rootScope,
    ActionTypes,
    Roles,
    $route
  ) {
    return {
      getInitialState: function() {
        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;

        TaReaderUtilizationReportService.getCourses(workgroupId, year);

        TaReaderUtilizationReportReducers._state = {};

        TaReaderUtilizationReportReducers.reduce({
          type: ActionTypes.INIT_STATE,
          payload: {}
        });
      },
    };
  }
}

TaReaderUtilizationReportActions.$inject = [
  "TaReaderUtilizationReportReducers",
  "TaReaderUtilizationReportService",
  "$rootScope",
  "ActionTypes",
  "Roles",
  "$route"
];

export default TaReaderUtilizationReportActions;
