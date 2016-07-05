window.courseApp = angular.module("courseApp", ["sharedApp", "ngRoute"]);

courseApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:courseCode/:year", {
			templateUrl: "CourseCtrl.html",
			controller: "CourseCtrl",
			resolve: {
				payload: CourseCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "CourseCtrl.html",
			controller: "CourseCtrl",
			resolve: {
				payload: CourseCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});
