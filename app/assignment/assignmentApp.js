window.assignmentApp = angular.module("assignmentApp", ["sharedApp", "ngRoute"]);

assignmentApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			resolve: {
				validate: AssignmentCtrl.validate
			}
		})
		.when("/:workgroupId/:year/teachingCall", {
			templateUrl: "TeachingCallForm.html",
			controller: "TeachingCallFormCtrl",
			resolve: {
				validate: TeachingCallFormCtrl.validate
			}
		})
		.when("/:workgroupId/:year/teachingCallStatus", {
			templateUrl: "TeachingCallStatus.html",
			controller: "TeachingCallStatusCtrl",
			resolve: {
				validate: TeachingCallStatusCtrl.validate
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
var SWITCH_MAIN_VIEW = "SWITCH_MAIN_VIEW";
var TOGGLE_TERM_FILTER = "TOGGLE_TERM_FILTER";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var ADD_SCHEDULE_INSTRUCTOR_NOTE = "ADD_SCHEDULE_INSTRUCTOR_NOTE";
var UPDATE_SCHEDULE_INSTRUCTOR_NOTE = "UPDATE_SCHEDULE_INSTRUCTOR_NOTE";
var ADD_TEACHING_CALL_RESPONSE = "ADD_TEACHING_CALL_RESPONSE";
var UPDATE_TEACHING_CALL_RESPONSE = "UPDATE_TEACHING_CALL_RESPONSE";
var INIT_ACTIVE_TEACHING_CALL = "INIT_ACTIVE_TEACHING_CALL";
var ADD_PREFERENCE = "ADD_PREFERENCE";
var REMOVE_PREFERENCE = "REMOVE_PREFERENCE";
var UPDATE_TEACHING_CALL_RECEIPT = "UPDATE_TEACHING_CALL_RECEIPT";
var CREATE_TEACHING_CALL = "CREATE_TEACHING_CALL";
var UPDATE_TEACHING_ASSIGNMENT_ORDER = "UPDATE_TEACHING_ASSIGNMENT_ORDER";
var UPDATE_TAG_FILTERS = "UPDATE_TAG_FILTERS";