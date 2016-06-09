window.workgroupApp = angular.module("workgroupApp", ["sharedApp", "ngRoute"]);

workgroupApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupCode/:year", {
			templateUrl: "WorkgroupCtrl.html",
			controller: "WorkgroupCtrl",
			resolve: {
				authenticate: WorkgroupCtrl.authenticate
			}
		})
		.when("/", {
			templateUrl: "WorkgroupCtrl.html",
			controller: "WorkgroupCtrl",
			resolve: {
				authenticate: WorkgroupCtrl.authenticate
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var ADD_TAG = "ADD_TAG";
var REMOVE_TAG = "REMOVE_TAG";
var UPDATE_TAG = "UPDATE_TAG";
var INIT_WORKGROUP = "INIT_WORKGROUP";
