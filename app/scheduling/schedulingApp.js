window.schedulingApp = angular.module("schedulingApp", ["sharedApp", "ngRoute"]);

schedulingApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year/:termShortCode", {
			templateUrl: "SchedulingCtrl.html",
			controller: "SchedulingCtrl",
			resolve: {
				payload: SchedulingCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "SchedulingCtrl.html",
			controller: "SchedulingCtrl",
			resolve: {
				payload: SchedulingCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: function () {
				window.location = "/not-found.html";
			}
		});
});

var INIT_STATE = "INIT_STATE";
var SECTION_GROUP_SELECTED = "SECTION_GROUP_SELECTED";
var FETCH_SECTION_GROUP_DETAILS = "FETCH_SECTION_GROUP_DETAILS";
var FETCH_ALL_SECTION_GROUP_DETAILS = "FETCH_ALL_SECTION_GROUP_DETAILS";
var SECTION_GROUP_TOGGLED = "SECTION_GROUP_TOGGLED";
var ACTIVITY_SELECTED = "ACTIVITY_SELECTED";
var TOGGLE_DAY = "TOGGLE_DAY";
var UPDATE_TAG_FILTERS = "UPDATE_TAG_FILTERS";
var UPDATE_LOCATION_FILTERS = "UPDATE_LOCATION_FILTERS";
var UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
var REMOVE_ACTIVITY = "REMOVE_ACTIVITY";
var CREATE_SHARED_ACTIVITY = "CREATE_SHARED_ACTIVITY";
var CREATE_ACTIVITY = "CREATE_ACTIVITY";
var CHECK_ALL_TOGGLED = "CHECK_ALL_TOGGLED";
var FETCH_COURSE_ACTIVITY_TYPES = "FETCH_COURSE_ACTIVITY_TYPES";
