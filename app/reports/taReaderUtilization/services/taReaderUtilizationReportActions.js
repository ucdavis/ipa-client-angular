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

        TaReaderUtilizationReportReducers._state = {};

        TaReaderUtilizationReportReducers.reduce({
          type: ActionTypes.INIT_STATE,
          payload: {}
        });

        TaReaderUtilizationReportService.getBudget(workgroupId, year).then(
          function(payload) {
            var action = {
              type: ActionTypes.GET_CURRENT_BUDGET,
              payload: payload
            };
            TaReaderUtilizationReportReducers.reduce(action);
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };

        TaReaderUtilizationReportService.getCourses(workgroupId, year).then(
          function(payload) {
            var action = {
              type: ActionTypes.GET_CURRENT_COURSES,
              payload: payload
            };
            TaReaderUtilizationReportReducers.reduce(action);
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };

        TaReaderUtilizationReportService.getSectionGroupCosts(
          workgroupId,
          year
        ).then(function(payload) {
          var action = {
            type: ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS,
            payload: payload
          };
          TaReaderUtilizationReportReducers.reduce(action);
        }),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
      }
    };
  }
}

TaReaderUtilizationReportActions.$inject = [
  'TaReaderUtilizationReportReducers',
  'TaReaderUtilizationReportService',
  '$rootScope',
  'ActionTypes',
  'Roles',
  '$route'
];

export default TaReaderUtilizationReportActions;
