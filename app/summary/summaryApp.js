window.summaryApp = angular.module("summaryApp", ["sharedApp", "ngRoute"]);

summaryApp.config(function ($routeProvider) {
	return $routeProvider
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
