window.supportAssignmentApp = angular.module("supportAssignmentApp", ["sharedApp", "ngRoute"]);

supportAssignmentApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/", {
			templateUrl: "SupportAssignmentCtrl.html",
			controller: "SupportAssignmentCtrl",
			resolve: {
				payload: InstructionalSupportAssignmentCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode", {
			templateUrl: "SupportAssignmentCtrl.html",
			controller: "SupportAssignmentCtrl",
			reloadOnSearch: false,
			resolve: {
				payload: InstructionalSupportAssignmentCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});
// UI ACTIONS
var SET_PIVOT_COURSE = "SET_PIVOT_COURSE";
var SET_PIVOT_STAFF = "SET_PIVOT_STAFF";
var SET_VIEW_READER = "SET_VIEW_READER";
var SET_VIEW_TA = "SET_VIEW_TA";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";

// API ACTIONS
var INIT_STATE = "INIT_STATE";
var UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW = "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW = "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW";
var DELETE_ASSIGNMENT = "DELETE_ASSIGNMENT";

// CALCULATIONS
