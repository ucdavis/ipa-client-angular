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

var INIT_ASSIGNMENT_VIEW = "INIT_ASSIGNMENT_VIEW";
var ADD_TEACHING_PREFERENCES = "ADD_TEACHING_PREFERENCES";