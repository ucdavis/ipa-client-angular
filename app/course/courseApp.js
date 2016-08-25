window.courseApp = angular.module("courseApp", ["sharedApp", "ngRoute"]);

courseApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "CourseCtrl.html",
			controller: "CourseCtrl",
			resolve: {
				payload: CourseCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "CourseCtrl.html",
			controller: "CourseCtrl",
			resolve: {
				payload: CourseCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
var NEW_COURSE = "NEW_COURSE";
var CREATE_COURSE = "CREATE_COURSE";
var REMOVE_COURSE = "REMOVE_COURSE";
var UPDATE_COURSE = "UPDATE_COURSE";
var GET_COURSE_CENSUS = "GET_COURSE_CENSUS";
var ADD_SECTION_GROUP = "ADD_SECTION_GROUP";
var REMOVE_SECTION_GROUP = "REMOVE_SECTION_GROUP";
var UPDATE_SECTION_GROUP = "UPDATE_SECTION_GROUP";
var TOGGLE_TERM_FILTER = "TOGGLE_TERM_FILTER";
var CELL_SELECTED = "CELL_SELECTED";
var CLOSE_DETAILS = "CLOSE_DETAILS";
var CLOSE_NEW_COURSE_DETAILS = "CLOSE_NEW_COURSE_DETAILS";
var FETCH_SECTIONS = "FETCH_SECTIONS";
var CREATE_SECTION = "CREATE_SECTION";
var UPDATE_SECTION = "UPDATE_SECTION";
var REMOVE_SECTION = "REMOVE_SECTION";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var BEGIN_IMPORT_MODE = "BEGIN_IMPORT_MODE";
var END_IMPORT_MODE = "END_IMPORT_MODE";
var SEARCH_IMPORT_COURSES = "SEARCH_IMPORT_COURSES";
var TOGGLE_IMPORT_COURSE = "TOGGLE_IMPORT_COURSE";
