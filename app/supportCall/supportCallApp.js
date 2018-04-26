// Controllers
import SupportCallStatusCtrl from './controllers/SupportCallStatusCtrl.js';
import ModalAddSupportCallCtrl from './controllers/ModalAddSupportCallCtrl.js';

// Services
import SupportCallStatusActionCreators from './services/supportCallStatusActionCreators.js';
import SupportCallStatusService from './services/supportCallStatusService.js';
import SupportCallStatusStateService from './services/supportCallStatusStateService.js';
import SupportCallStatusSelectors from './services/supportCallStatusSelectors.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Directives
import instructorSupportCallTooltip from './directives/instructorSupportCallTooltip.js';
import modalAddSupportCall from './directives/modalAddSupportCall/modalAddSupportCall.js';
import studentSupportCallTooltip from './directives/studentSupportCallTooltip.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		template: require('./templates/SupportCallStatus.html'),
		controller: "SupportCallStatusCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});
};

config.$inject = ['$routeProvider'];

// App declaration
const supportCallApp = angular.module("supportCallApp", dependencies)
.config(config)
.controller('SupportCallStatusCtrl', SupportCallStatusCtrl)
.controller('ModalAddSupportCallCtrl', ModalAddSupportCallCtrl)
.service('SupportCallStatusActionCreators', SupportCallStatusActionCreators)
.service('SupportCallStatusService', SupportCallStatusService)
.service('SupportCallStatusStateService', SupportCallStatusStateService)
.service('SupportCallStatusSelectors', SupportCallStatusSelectors)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('AuthService', AuthService)
.directive('instructorSupportCallTooltip', instructorSupportCallTooltip)
.directive('modalAddSupportCall', modalAddSupportCall)
.directive('studentSupportCallTooltip', studentSupportCallTooltip)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	ADD_ASSIGNMENT_SLOTS: "ADD_ASSIGNMENT_SLOTS",
	TOGGLE_ASSIGNMENT_PIVOT_VIEW: "TOGGLE_ASSIGNMENT_PIVOT_VIEW",
	DELETE_ASSIGNMENT: "DELETE_ASSIGNMENT",
	ADD_STUDENT_SUPPORT_CALL: "ADD_STUDENT_SUPPORT_CALL",
	DELETE_STUDENT_SUPPORT_CALL: "DELETE_STUDENT_SUPPORT_CALL",
	ADD_INSTRUCTOR_SUPPORT_CALL: "ADD_INSTRUCTOR_SUPPORT_CALL",
	DELETE_INSTRUCTOR_SUPPORT_CALL: "DELETE_INSTRUCTOR_SUPPORT_CALL",
	ADD_STUDENT_PREFERENCE: "ADD_STUDENT_PREFERENCE",
	DELETE_STUDENT_PREFERENCE: "DELETE_STUDENT_PREFERENCE",
	ASSIGN_STAFF_TO_SLOT: "ASSIGN_STAFF_TO_SLOT",
	REMOVE_STAFF_FROM_SLOT: "REMOVE_STAFF_FROM_SLOT",
	UPDATE_SUPPORT_CALL_RESPONSE: "UPDATE_SUPPORT_CALL_RESPONSE",
	UPDATE_PREFERENCES_ORDER: "UPDATE_PREFERENCES_ORDER",
	OPEN_INSTRUCTOR_SUPPORT_CALL_REVIEW: "OPEN_INSTRUCTOR_SUPPORT_CALL_REVIEW",
	OPEN_STUDENT_SUPPORT_CALL_REVIEW: "OPEN_STUDENT_SUPPORT_CALL_REVIEW",
	ADD_INSTRUCTOR_PREFERENCE: "ADD_INSTRUCTOR_PREFERENCE",
	DELETE_INSTRUCTOR_PREFERENCE: "DELETE_INSTRUCTOR_PREFERENCE",
	CONTACT_STUDENT_SUPPORT_CALL: "CONTACT_STUDENT_SUPPORT_CALL",
	CONTACT_INSTRUCTOR_SUPPORT_CALL: "CONTACT_INSTRUCTOR_SUPPORT_CALL",
	UPDATE_TABLE_FILTER: "UPDATE_TABLE_FILTER",
	UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW: "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW",
	UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW: "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW",
	UPDATE_PREFERENCE: "UPDATE_PREFERENCE",
	ASSIGN_STAFF_TO_SECTION_GROUP_SLOT: "ASSIGN_STAFF_TO_SECTION_GROUP_SLOT"
});

export default supportCallApp;
