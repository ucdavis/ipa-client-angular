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
var SET_VIEW_READER = "SET_VIEW_READER";
var SET_VIEW_TA = "SET_VIEW_TA";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var SET_VIEW_PIVOT = "SET_VIEW_PIVOT";

// API ACTIONS
var INIT_STATE = "INIT_STATE";
var UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW = "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW = "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW";
var DELETE_ASSIGNMENT = "DELETE_ASSIGNMENT";

// CALCULATIONS
