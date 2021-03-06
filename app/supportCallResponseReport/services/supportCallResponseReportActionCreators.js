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
      getInitialState: function () {
        let workgroupId = $route.current.params.workgroupId;
        let year = $route.current.params.year;
        let termShortCode = $route.current.params.termShortCode;

        SupportCallResponseReportService.getInitialState(
          workgroupId,
          year,
          termShortCode
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
      toggleFilter: function (filter) {
        filter.selected = !filter.selected;

        SupportCallResponseReportStateService.reduce({
          type: ActionTypes.TOGGLE_FILTER,
          payload: {
            filter
          }
        });
      }
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
