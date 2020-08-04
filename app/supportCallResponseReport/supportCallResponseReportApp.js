import './supportCallResponseReport.css';

// Controller imports
import SupportCallResponseReportCtrl from './supportCallResponseReportCtrl.js';

// Service imports
import SupportCallResponseReportActionCreators from './services/supportCallResponseReportActionCreators.js';
import SupportCallResponseReportService from './services/supportCallResponseReportService.js';
import SupportCallResponseReportStateService from './services/supportCallResponseReportStateService.js';

// Shared service imports
import TermService from './../shared/services/TermService.js';
import SupportCallService from './../shared/services/SupportCallService.js';
import AvailabilityService from './../shared/services/AvailabilityService.js';

// Dependencies
var dependencies = ['sharedApp', 'ngRoute'];

// Config
function config($routeProvider) {
  return $routeProvider
    .when('/:workgroupId/:year', {
      template: require('./supportCallResponseReportCtrl.html'),
      controller: 'SupportCallResponseReportCtrl',
      resolve: {
        validate: function (
          AuthService,
        ) {
          return AuthService.validate();
        },
      },
    })
    .when('/:workgroupId/:year/:termShortCode', {
      template: require('./supportCallResponseReportCtrl.html'),
      controller: 'SupportCallResponseReportCtrl',
      resolve: {
        validate: function (
          AuthService,
          $route,
          SupportCallResponseReportActionCreators
        ) {
          return AuthService.validate().then(function () {
            if ($route.current.params.workgroupId) {
              var hasAccess = AuthService.getCurrentUser().hasAccess(
                'academicPlanner',
                $route.current.params.workgroupId
              );

              if (hasAccess) {
                return SupportCallResponseReportActionCreators.getInitialState();
              } else {
                return { noAccess: true };
              }
            }
          });
        },
      },
    })
    .otherwise({
      redirectTo: function () {
        window.location = '/not-found.html';
      },
    });
}

config.$inject = ['$routeProvider'];

// App declaration
const SupportCallResponseReportApp = angular // eslint-disable-line no-undef
  .module('SupportCallResponseReportApp', dependencies)
  .config(config)
  .controller('SupportCallResponseReportCtrl', SupportCallResponseReportCtrl)
  .service(
    'SupportCallResponseReportActionCreators',
    SupportCallResponseReportActionCreators
  )
  .service('SupportCallResponseReportService', SupportCallResponseReportService)
  .service(
    'SupportCallResponseReportStateService',
    SupportCallResponseReportStateService
  )
  .service('TermService', TermService)
  .service('SupportCallService', SupportCallService)
  .service('AvailabilityService', AvailabilityService)
  .constant('ActionTypes', {
    INIT_STATE: 'INIT_STATE',
  });

export default SupportCallResponseReportApp;
