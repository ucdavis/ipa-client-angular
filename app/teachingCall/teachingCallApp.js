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
var CREATE_TEACHING_CALL = "CREATE_TEACHING_CALL";
var DELETE_TEACHING_CALL = "DELETE_TEACHING_CALL";
