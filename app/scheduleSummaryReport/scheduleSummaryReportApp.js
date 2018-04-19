// ScheduleSummaryReport controllers
import ScheduleSummaryReportCtrl from './controllers/scheduleSummaryReportCtrl.js';

// ScheduleSummaryReport services
import './services/scheduleSummaryActionCreators.js';
import './services/scheduleSummaryService.js';
import './services/scheduleSummaryStateService.js';

// CONSTANTS
var INIT_STATE = "INIT_STATE";

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// App declaration
const scheduleSummaryReportApp = angular.module("scheduleSummaryReportApp", dependencies)
.config(function ($routeProvider) {
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
})
.controller('ScheduleSummaryReportCtrl', ScheduleSummaryReportCtrl);

export default scheduleSummaryReportApp;