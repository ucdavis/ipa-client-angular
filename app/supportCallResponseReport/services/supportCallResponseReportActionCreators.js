class SupportCallResponseReportActionCreators {
  constructor(
    SupportCallResponseReportStateService,
    SupportCallResponseReportService,
    $rootScope,
    ActionTypes,
    $route
  ) {
    this.supportCallResponseReportStateService = SupportCallResponseReportStateService;
    this.supportCallResponseReportService = SupportCallResponseReportService;
    this.$rootScope = $rootScope;
    this.ActionTypes = ActionTypes;

    return {
      getInitialState: function (workgroupId, year) {
        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;

        SupportCallResponseReportService.getInitialState(
          workgroupId,
          year,
          '05'
        ).then(
          function (payload) {
            var action = {
              type: ActionTypes.INIT_STATE,
              payload: payload,
              year: year,
            };
            SupportCallResponseReportStateService.reduce(action);
          },
          function () {
            $rootScope.$emit('toast', {
              message:
                'Could not load teaching call response report initial state.',
              type: 'ERROR',
            });
          }
        );
      },
    };
  }
}

SupportCallResponseReportActionCreators.$inject = [
  'SupportCallResponseReportStateService',
  'SupportCallResponseReportService',
  '$rootScope',
  'ActionTypes',
  '$route',
];

export default SupportCallResponseReportActionCreators;
