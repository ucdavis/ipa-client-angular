window.workgroupsApp = angular.module("workgroupsApp", ["sharedApp", "ngRoute"]);

workgroupsApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/", {
			templateUrl: "WorkgroupsCtrl.html",
			controller: "WorkgroupsCtrl",
			resolve: {
				authenticate: WorkgroupsCtrl.authenticate //TODO: Change to sharedApp
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});