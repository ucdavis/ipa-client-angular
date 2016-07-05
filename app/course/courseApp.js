window.courseApp = angular.module("courseApp", ["sharedApp", "ngRoute"]);

courseApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:courseCode/:year", {
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
var ADD_COURSE = "ADD_COURSE";
var REMOVE_COURSE = "REMOVE_COURSE";
var UPDATE_COURSE = "UPDATE_COURSE";
var ADD_SECTION_GROUP = "ADD_SECTION_GROUP";
var REMOVE_SECTION_GROUP = "REMOVE_SECTION_GROUP";
var UPDATE_SECTION_GROUP = "UPDATE_SECTION_GROUP";
