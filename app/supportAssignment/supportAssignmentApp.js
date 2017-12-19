window.supportAssignmentApp = angular.module("supportAssignmentApp", ["sharedApp", "ngRoute"]);

supportAssignmentApp.config(function ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		templateUrl: "SupportAssignmentCtrl.html",
		controller: "SupportAssignmentCtrl",
		resolve: {
			payload: SupportAssignmentCtrl.getPayload
		}
	})
	.otherwise({
		redirectTo: "/"
	});
});
// UI ACTIONS
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var SET_VIEW_PIVOT = "SET_VIEW_PIVOT";
var SET_VIEW_TYPE = "SET_VIEW_TYPE";
var SET_SUPPORT_STAFF_TAB = "SET_SUPPORT_STAFF_TAB";

// API ACTIONS
var INIT_STATE = "INIT_STATE";
var UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW = "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW = "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW";
var DELETE_ASSIGNMENT = "DELETE_ASSIGNMENT";
var UPDATE_SECTIONGROUP = "UPDATE_SECTIONGROUP";
// CALCULATIONS
