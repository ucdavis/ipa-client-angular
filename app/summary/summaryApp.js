window.summaryApp = angular.module("summaryApp", ["sharedApp", "ngRoute"]);

summaryApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			controller: "SummaryCtrl",
			resolve: {
				authenticate: SummaryCtrl.authenticate
			}
		})
		.when("/", {
			templateUrl: "SummaryCtrl.html",
			controller: "SummaryCtrl",
			resolve: {
				authenticate: SummaryCtrl.authenticate
			}
		})
		.when("/:workgroupId/:year/workgroup", {
			templateUrl: "SummaryWorkgroup.html",
			controller: "SummaryCtrl",
			resolve: {
				authenticate: SummaryCtrl.authenticate
			}
		})
		.when("/:workgroupId/:year/instructor", {
			templateUrl: "SummaryInstructor.html",
			controller: "SummaryCtrl",
			resolve: {
				authenticate: SummaryCtrl.authenticate
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";