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
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
