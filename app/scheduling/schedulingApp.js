window.schedulingApp = angular.module("schedulingApp", ["sharedApp", "ngRoute"]);

schedulingApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year/:termCode", {
			templateUrl: "SchedulingCtrl.html",
			controller: "SchedulingCtrl",
			resolve: {
				payload: SchedulingCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year", {
			templateUrl: "not-found.html"
		})
		.when("/", {
			templateUrl: "SchedulingCtrl.html",
			controller: "SchedulingCtrl",
			resolve: {
				payload: SchedulingCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
var SECTION_GROUP_SELECTED = "SECTION_GROUP_SELECTED";
var FETCH_SECTION_GROUP_DETAILS = "FETCH_SECTION_GROUP_DETAILS";
var SECTION_GROUP_TOGGLED = "SECTION_GROUP_TOGGLED";
var ACTIVITY_SELECTED = "ACTIVITY_SELECTED";
var TOGGLE_DAY = "TOGGLE_DAY";
var UPDATE_TAG_FILTERS = "UPDATE_TAG_FILTERS";
var UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
var REMOVE_ACTIVITY = "REMOVE_ACTIVITY";
var CREATE_SHARED_ACTIVITY = "CREATE_SHARED_ACTIVITY";
var CREATE_ACTIVITY = "CREATE_ACTIVITY";
