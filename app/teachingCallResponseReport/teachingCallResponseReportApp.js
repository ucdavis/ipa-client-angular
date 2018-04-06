window.teachingCallResponseReportApp = angular.module("teachingCallResponseReportApp", ["sharedApp", "ngRoute"]);

teachingCallResponseReportApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "TeachingCallResponseReportCtrl.html",
			controller: "TeachingCallResponseReportCtrl",
			resolve: {
				payload: TeachingCallResponseReportCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: function () {
				window.location = "/not-found.html";
			}
		});
});

var INIT_STATE = "INIT_STATE";
