window.teachingCallApp = angular.module("teachingCallApp", ["sharedApp", "ngRoute"]);

teachingCallApp.config(function ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/teachingCall", {
		templateUrl: "TeachingCallForm.html",
		controller: "TeachingCallFormCtrl",
		resolve: {
			validate: TeachingCallFormCtrl.validate
		}
	})
	.when("/:workgroupId/:year/teachingCallStatus", {
		templateUrl: "TeachingCallStatus.html",
		controller: "TeachingCallStatusCtrl",
		resolve: {
			validate: TeachingCallStatusCtrl.validate
		}
	})
});

var INIT_STATE = "INIT_STATE";

// TeachingCallForm Actions
var UPDATE_TEACHING_ASSIGNMENT_ORDER = "UPDATE_TEACHING_ASSIGNMENT_ORDER";
var ADD_PREFERENCE = "ADD_PREFERENCE";
var REMOVE_PREFERENCE = "REMOVE_PREFERENCE";
var ADD_TEACHING_CALL_RESPONSE = "ADD_TEACHING_CALL_RESPONSE";
var UPDATE_TEACHING_CALL_RESPONSE = "UPDATE_TEACHING_CALL_RESPONSE";
var UPDATE_TEACHING_CALL_RECEIPT = "UPDATE_TEACHING_CALL_RECEIPT";

// TeachingCallStatus Actions
var CONTACT_INSTRUCTORS = "CONTACT_INSTRUCTORS";
var ADD_INSTRUCTORS_TO_TEACHING_CALL = "ADD_INSTRUCTORS_TO_TEACHING_CALL";
var REMOVE_INSTRUCTOR_FROM_TEACHING_CALL = "REMOVE_INSTRUCTOR_FROM_TEACHING_CALL";
