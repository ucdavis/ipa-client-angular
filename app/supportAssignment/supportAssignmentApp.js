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

// UNSORTED ACTIONS
var INIT_STATE = "INIT_STATE";
var TOGGLE_ASSIGNMENT_PIVOT_VIEW = "TOGGLE_ASSIGNMENT_PIVOT_VIEW";
var DELETE_ASSIGNMENT = "DELETE_ASSIGNMENT";
var ADD_STUDENT_PREFERENCE = "ADD_STUDENT_PREFERENCE";
var DELETE_STUDENT_PREFERENCE = "DELETE_STUDENT_PREFERENCE";
var OPEN_INSTRUCTOR_SUPPORT_CALL_REVIEW = "OPEN_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var OPEN_STUDENT_SUPPORT_CALL_REVIEW = "OPEN_STUDENT_SUPPORT_CALL_REVIEW";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW = "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW = "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW";
var UPDATE_PREFERENCE = "UPDATE_PREFERENCE";
var ASSIGN_STAFF_TO_SECTION_GROUP_SLOT = "ASSIGN_STAFF_TO_SECTION_GROUP_SLOT";