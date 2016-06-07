window.workgroupsApp = angular.module("workgroupsApp", ["sharedApp", "ngRoute"]);

workgroupsApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupCode/:year", {
			templateUrl: "WorkgroupsCtrl.html",
			controller: "WorkgroupsCtrl",
			resolve: {
				authenticate: WorkgroupsCtrl.authenticate
			}
		})
		.when("/", {
			templateUrl: "WorkgroupsCtrl.html",
			controller: "WorkgroupsCtrl",
			resolve: {
				authenticate: WorkgroupsCtrl.authenticate
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var ADD_TAG = "ADD_TAG";
var REMOVE_TAG = "REMOVE_TAG";
var UPDATE_TAG = "UPDATE_TAG";
