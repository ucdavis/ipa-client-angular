// ScheduleSummaryReport controllers
import ScheduleSummaryReportCtrl from './controllers/scheduleSummaryReportCtrl.js';

// ScheduleSummaryReport services
import ScheduleSummaryReportActionCreators from './services/scheduleSummaryReportActionCreators.js';
import ScheduleSummaryReportService from './services/scheduleSummaryReportService.js';
import ScheduleSummaryReportStateService from './services/scheduleSummaryReportStateService.js';

// CONSTANTS
var INIT_STATE = "INIT_STATE";

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
				payload: ScheduleSummaryReportCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				payload: ScheduleSummaryReportCtrl.getPayload
			}
		})
		.when("/", {
			template: require('./templates/ScheduleSummaryReportCtrl.html'),
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				payload: ScheduleSummaryReportCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: function () {
				window.location = "/not-found.html";
			}
		});
};

config.$inject = ['$routeProvider'];

// App declaration
const scheduleSummaryReportApp = angular.module("scheduleSummaryReportApp", dependencies)
.config(config)
.controller('ScheduleSummaryReportCtrl', ScheduleSummaryReportCtrl)
.service('ScheduleSummaryReportActionCreators', ScheduleSummaryReportActionCreators)
.service('ScheduleSummaryReportService', ScheduleSummaryReportService)
.service('ScheduleSummaryReportStateService', ScheduleSummaryReportStateService);

export default scheduleSummaryReportApp;