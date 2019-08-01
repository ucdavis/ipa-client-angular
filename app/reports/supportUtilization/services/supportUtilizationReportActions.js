class SupportUtilizationReportActions {
  constructor(
    SupportUtilizationReportReducers,
    SupportUtilizationReportService,
    $rootScope,
    ActionTypes,
    Roles,
    $route
  ) {
    return {
      getInitialState: function() {
        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;

        SupportUtilizationReportService.getCourses(workgroupId, year);

        SupportUtilizationReportReducers._state = {};

        SupportUtilizationReportReducers.reduce({
          type: ActionTypes.INIT_STATE,
          payload: {}
        });
      },
    };
  }
}

SupportUtilizationReportActions.$inject = [
  "SupportUtilizationReportReducers",
  "SupportUtilizationReportService",
  "$rootScope",
  "ActionTypes",
  "Roles",
  "$route"
];

export default SupportUtilizationReportActions;
