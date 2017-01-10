window.scheduleSummaryReportApp = angular.module("scheduleSummaryReportApp", ["sharedApp", "ngRoute"]);

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

var INIT_STATE = "INIT_STATE";