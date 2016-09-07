window.adminApp = angular.module("adminApp", ["sharedApp", "ngRoute"]);

adminApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "AdminCtrl.html",
			controller: "AdminCtrl",
			resolve: {
				payload: AdminCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "AdminCtrl.html",
			controller: "AdminCtrl",
			resolve: {
				payload: AdminCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
