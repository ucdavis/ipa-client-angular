import './reportFilter.css';

let reportFilter = function (
  $rootScope,
  RegistrarReconciliationReportActionCreators
) {
  return {
    restrict: 'E',
    template: require('./reportFilter.html'),
    replace: true,
    link: function (scope) {
      $rootScope.$on('reportStateChanged', function (event, data) {
        scope.filters = data.state.uiState.filters;
      });

      scope.updateFilter = function (filter) {
        RegistrarReconciliationReportActionCreators.updateFilters(filter);
      };
    },
  };
};

export default reportFilter;
