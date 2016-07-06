window.assignmentApp = angular.module("assignmentApp", ["sharedApp", "ngRoute"]);

assignmentApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			resolve: {
				validate: AssignmentCtrl.validate
			}
		})
		.when("/", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			resolve: {
				validate: AssignmentCtrl.validate
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
var ADD_USER = "ADD_USER";
var REMOVE_USER = "REMOVE_USER";
var ADD_USER_ROLE = "ADD_USER_ROLE";
var REMOVE_USER_ROLE = "REMOVE_USER_ROLE";
var INIT_WORKGROUP = "INIT_WORKGROUP";
var SEARCH_USERS = "SEARCH_USERS";