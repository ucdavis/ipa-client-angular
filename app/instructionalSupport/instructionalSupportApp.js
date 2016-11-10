window.instructionalSupportApp = angular.module("instructionalSupportApp", ["sharedApp", "ngRoute"]);

instructionalSupportApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/", {
			templateUrl: "InstructionalSupportAssignment.html",
			controller: "InstructionalSupportAssignmentCtrl",
			resolve: {
				payload: InstructionalSupportAssignmentCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/supportCallStatus", {
			templateUrl: "SupportCallStatus.html",
			controller: "InstructionalSupportCallStatusCtrl",
			resolve: {
				validate: InstructionalSupportCallStatusCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode", {
			templateUrl: "InstructionalSupportAssignment.html",
			controller: "InstructionalSupportAssignmentCtrl",
			reloadOnSearch: false,
			resolve: {
				payload: InstructionalSupportAssignmentCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode/instructorSupportCallForm", {
			templateUrl: "InstructorSupportCallForm.html",
			controller: "InstructorSupportCallFormCtrl",
			resolve: {
				payload: InstructorSupportCallFormCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode/studentSupportCallForm", {
			templateUrl: "StudentSupportCallForm.html",
			controller: "StudentSupportCallFormCtrl",
			resolve: {
				payload: StudentSupportCallFormCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
var ADD_ASSIGNMENT_SLOTS = "ADD_ASSIGNMENT_SLOTS";