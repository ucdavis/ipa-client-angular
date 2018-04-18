// Found in 'dist' via resolve config
import 'templates/scheduleSummaryReport/scheduleSummaryReportCtrlTemplate.js';

// ScheduleSummaryReport controllers
import './controllers/scheduleSummaryReportCtrl.js';

// ScheduleSummaryReport services
import './services/scheduleSummaryActionCreators.js';
import './services/scheduleSummaryService.js';
import './services/scheduleSummaryStateService.js';

// CONSTANTS
var INIT_STATE = "INIT_STATE";

// App declaration
const scheduleSummaryReportApp = angular.module("scheduleSummaryReportApp", [
	"sharedApp",
	"ngRoute"
]);

scheduleSummaryReportApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "ScheduleSummaryReportCtrl.html",
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				payload: ScheduleSummaryReportCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode", {
			templateUrl: "ScheduleSummaryReportCtrl.html",
			controller: "ScheduleSummaryReportCtrl",
			resolve: {
				payload: ScheduleSummaryReportCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "ScheduleSummaryReportCtrl.html",
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
});

export default scheduleSummaryReportApp;