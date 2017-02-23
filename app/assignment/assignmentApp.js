window.assignmentApp = angular.module("assignmentApp", ["sharedApp", "ngRoute"]);

assignmentApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			reloadOnSearch: false,
			resolve: {
				validate: AssignmentCtrl.validate
			}
		})
		.when("/", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			resolve: {
				validate: AssignmentCtrl.validate
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_ASSIGNMENT_VIEW = "INIT_ASSIGNMENT_VIEW";
var ADD_TEACHING_ASSIGNMENT = "ADD_TEACHING_ASSIGNMENT";
var UPDATE_TEACHING_ASSIGNMENT = "UPDATE_TEACHING_ASSIGNMENT";
var REMOVE_TEACHING_ASSIGNMENT = "REMOVE_TEACHING_ASSIGNMENT";
var ADD_SCHEDULE_INSTRUCTOR_NOTE = "ADD_SCHEDULE_INSTRUCTOR_NOTE";
var UPDATE_SCHEDULE_INSTRUCTOR_NOTE = "UPDATE_SCHEDULE_INSTRUCTOR_NOTE";
var ADD_TEACHING_CALL_RESPONSE = "ADD_TEACHING_CALL_RESPONSE";
var UPDATE_TEACHING_CALL_RESPONSE = "UPDATE_TEACHING_CALL_RESPONSE";
var UPDATE_TEACHING_CALL_RECEIPT = "UPDATE_TEACHING_CALL_RECEIPT";

// UI state manipulations
var SWITCH_MAIN_VIEW = "SWITCH_MAIN_VIEW";
var TOGGLE_TERM_FILTER = "TOGGLE_TERM_FILTER";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var UPDATE_TAG_FILTERS = "UPDATE_TAG_FILTERS";
var TOGGLE_UNPUBLISHED_COURSES = "TOGGLE_UNPUBLISHED_COURSES";
var TOGGLE_COMPLETED_INSTRUCTORS = "TOGGLE_COMPLETED_INSTRUCTORS";