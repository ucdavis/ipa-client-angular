window.workgroupApp = angular.module("workgroupApp", ["sharedApp", "ngRoute"]);

workgroupApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "WorkgroupCtrl.html",
			controller: "WorkgroupCtrl",
			reloadOnSearch: false,
			resolve: {
				payload: WorkgroupCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "WorkgroupCtrl.html",
			controller: "WorkgroupCtrl",
			resolve: {
				payload: WorkgroupCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var ADD_TAG = "ADD_TAG";
var REMOVE_TAG = "REMOVE_TAG";
var UPDATE_TAG = "UPDATE_TAG";
var ADD_LOCATION = "ADD_LOCATION";
var REMOVE_LOCATION = "REMOVE_LOCATION";
var UPDATE_LOCATION = "UPDATE_LOCATION";
var ADD_USER_COMPLETED = "ADD_USER_COMPLETED";
var REMOVE_USER = "REMOVE_USER";
var ADD_USER_ROLE = "ADD_USER_ROLE";
var REMOVE_USER_ROLE = "REMOVE_USER_ROLE";
var INIT_WORKGROUP = "INIT_WORKGROUP";
var SEARCH_USERS = "SEARCH_USERS";
var ADD_USER_PENDING = "ADD_USER_PENDING";