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
