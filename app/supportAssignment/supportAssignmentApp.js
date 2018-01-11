window.supportAssignmentApp = angular.module("supportAssignmentApp", ["sharedApp", "ngRoute"]);

supportAssignmentApp.config(function ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		templateUrl: "supportAssignmentCtrl.html",
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
var OPEN_AVAILABILITY_MODAL = "OPEN_AVAILABILITY_MODAL";
var CLOSE_AVAILABILITY_MODAL = "CLOSE_AVAILABILITY_MODAL";
var SET_READ_ONLY_MODE = "SET_READ_ONLY_MODE";

// API ACTIONS
var INIT_STATE = "INIT_STATE";
var UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW = "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW = "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW";
var DELETE_ASSIGNMENT = "DELETE_ASSIGNMENT";
var UPDATE_SECTIONGROUP = "UPDATE_SECTIONGROUP";
var ASSIGN_STAFF_TO_SECTION_GROUP = "ASSIGN_STAFF_TO_SECTION_GROUP";
var ASSIGN_STAFF_TO_SECTION = "ASSIGN_STAFF_TO_SECTION";
var UPDATE_SUPPORT_APPOINTMENT = "UPDATE_SUPPORT_APPOINTMENT";

// Calculations
var CALCULATE_SECTION_SCHEDULING = "CALCULATE_SECTION_SCHEDULING";
var CALCULATE_SECTION_GROUP_SCHEDULING = "CALCULATE_SECTION_GROUP_SCHEDULING";
var CALCULATE_SCHEDULE_CONFLICTS = "CALCULATE_SCHEDULE_CONFLICTS";
var CALCULATE_STAFF_ASSIGNMENT_OPTIONS = "CALCULATE_STAFF_ASSIGNMENT_OPTIONS";