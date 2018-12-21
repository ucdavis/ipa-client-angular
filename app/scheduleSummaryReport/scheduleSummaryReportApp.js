import './css/scheduleSummaryReport.css';

// Controllers
import ScheduleSummaryReportCtrl from './controllers/ScheduleSummaryReportCtrl.js';

// Services
import ScheduleSummaryReportActionCreators from './services/scheduleSummaryReportActionCreators.js';
import ScheduleSummaryReportService from './services/scheduleSummaryReportService.js';
import ScheduleSummaryReportStateService from './services/scheduleSummaryReportStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import DwService from './../shared/services/DwService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				validate: function (AuthService) {
					return AuthService.validate();
				}
			}
		})
		.when("/:workgroupId/:year/:termShortCode", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				validate: function (AuthService, $route, ScheduleSummaryReportActionCreators) {
					return AuthService.validate().then(function () {
						if ($route.current.params.workgroupId) {
							return ScheduleSummaryReportActionCreators.getInitialState();
						}
					});
				}
			}
		})
		.when("/", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				validate: function (AuthService) {
					return AuthService.validate();
				}
			}
		})
		.otherwise({
			redirectTo: function () {
				window.location = "/not-found.html";
			}
		});
}

config.$inject = ['$routeProvider'];

// App declaration
const scheduleSummaryReportApp = angular.module("scheduleSummaryReportApp", dependencies) // eslint-disable-line no-undef
.config(config)
.controller('ScheduleSummaryReportCtrl', ScheduleSummaryReportCtrl)
.service('ScheduleSummaryReportActionCreators', ScheduleSummaryReportActionCreators)
.service('ScheduleSummaryReportService', ScheduleSummaryReportService)
.service('ScheduleSummaryReportStateService', ScheduleSummaryReportStateService)
.service('DwService', DwService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE"
});

export default scheduleSummaryReportApp;