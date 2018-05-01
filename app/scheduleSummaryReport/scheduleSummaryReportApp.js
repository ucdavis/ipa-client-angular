// ScheduleSummaryReport controllers
import ScheduleSummaryReportCtrl from './controllers/scheduleSummaryReportCtrl.js';

// ScheduleSummaryReport services
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
			controller: "ScheduleSummaryReportCtrl"
		})
		.when("/:workgroupId/:year/:termShortCode", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl"
		})
		.when("/", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl"
		})
		.otherwise({
			redirectTo: function () {
				window.location = "/not-found.html";
			}
		});
}

config.$inject = ['$routeProvider'];

// App declaration
const scheduleSummaryReportApp = angular.module("scheduleSummaryReportApp", dependencies)
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