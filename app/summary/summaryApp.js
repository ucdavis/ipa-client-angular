window.summaryApp = angular.module("summaryApp", ["sharedApp", "ngRoute"]);

summaryApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupCode/:year", {
			templateUrl: "SummaryCtrl.html",
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
		.otherwise({
			redirectTo: "/"
		});
});
