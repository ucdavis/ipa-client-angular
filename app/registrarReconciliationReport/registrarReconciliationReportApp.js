window.registrarReconciliationReportApp = angular.module("registrarReconciliationReportApp", ["sharedApp", "ngRoute"]);

registrarReconciliationReportApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year/:termShortCode", {
			templateUrl: "ReportCtrl.html",
			controller: "ReportCtrl",
			resolve: {
				payload: ReportCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "ReportCtrl.html",
			controller: "ReportCtrl",
			resolve: {
				payload: ReportCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: function () {
				window.location = "/not-found.html";
			}
		});
});

var INIT_STATE = "INIT_STATE";
var UPDATE_SECTION = "UPDATE_SECTION";
var UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
var DELETE_ACTIVITY = "DELETE_ACTIVITY";
var CREATE_ACTIVITY = "CREATE_ACTIVITY";
var CREATE_SYNC_ACTION = "CREATE_SYNC_ACTION";
var DELETE_SYNC_ACTION = "DELETE_SYNC_ACTION";
var ASSIGN_INSTRUCTOR = "ASSIGN_INSTRUCTOR";
var UNASSIGN_INSTRUCTOR = "UNASSIGN_INSTRUCTOR";
var DELETE_SECTION = "DELETE_SECTION";


// TO-DO Actions
var ADD = "Add";
var DELETE = "Delete";
var UPDATE = "Change";