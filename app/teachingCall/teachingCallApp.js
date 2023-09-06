import './css/teaching-call.css';
import './css/teaching-call-modal.css';

// Controllers
import TeachingCallFormCtrl from './teachingCallForm/controllers/TeachingCallFormCtrl.js';
import TeachingCallStatusCtrl from './teachingCallStatus/controllers/TeachingCallStatusCtrl.js';

// Services
import TeachingCallFormActionCreators from './teachingCallForm/services/teachingCallFormActionCreators.js';
import TeachingCallFormService from './teachingCallForm/services/teachingCallFormService.js';
import TeachingCallFormStateService from './teachingCallForm/services/teachingCallFormStateService.js';

import TeachingCallStatusActionCreators from './teachingCallStatus/services/teachingCallStatusActionCreators.js';
import TeachingCallStatusService from './teachingCallStatus/services/teachingCallStatusService.js';
import TeachingCallStatusStateService from './teachingCallStatus/services/teachingCallStatusStateService.js';

import CourseService from './../course/services/courseService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Directives
import teachingCallTooltip from './teachingCallStatus/directives/teachingCallTooltip.js';
import addInstructorsModal from './teachingCallStatus/directives/modals/addInstructorsModal/addInstructorsModal.js';
import contactInstructorsModal from './teachingCallStatus/directives/modals/contactInstructorsModal/contactInstructorsModal.js';
import tutorialModal from './teachingCallForm/directives/modals/tutorialModal/tutorialModal.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/teachingCall", {
		template: require('./teachingCallForm/templates/TeachingCallForm.html'),
		controller: "TeachingCallFormCtrl",
		resolve: {
			validate: function (AuthService, $route, TeachingCallFormActionCreators) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						TeachingCallFormActionCreators.getInitialState();
					}
				});
			}
		}
	})
	.when("/:workgroupId/:year/teachingCallStatus", {
		template: require('./teachingCallStatus/templates/TeachingCallStatus.html'),
		controller: "TeachingCallStatusCtrl",
		resolve: {
			validate: function (AuthService, $route, TeachingCallStatusActionCreators) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						var hasAccess = AuthService.getCurrentUser().hasAccess('academicPlanner', $route.current.params.workgroupId);

						if (hasAccess) {
							return TeachingCallStatusActionCreators.getInitialState();
						} else {
							return { noAccess: true };
						}
					}
				});
			}
		}
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const teachingCallApp = angular.module("teachingCallApp", dependencies) // eslint-disable-line no-undef
.config(config)
.controller('TeachingCallFormCtrl', TeachingCallFormCtrl)
.controller('TeachingCallStatusCtrl', TeachingCallStatusCtrl)
.service('TeachingCallFormActionCreators', TeachingCallFormActionCreators)
.service('TeachingCallFormService', TeachingCallFormService)
.service('TeachingCallFormStateService', TeachingCallFormStateService)
.service('TeachingCallStatusActionCreators', TeachingCallStatusActionCreators)
.service('TeachingCallStatusService', TeachingCallStatusService)
.service('TeachingCallStatusStateService', TeachingCallStatusStateService)
.service('CourseService', CourseService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('AuthService', AuthService)
.directive('addInstructorsModal', addInstructorsModal)
.directive('contactInstructorsModal', contactInstructorsModal)
.directive('teachingCallTooltip', teachingCallTooltip)
.directive('tutorialModal', tutorialModal)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	UPDATE_TEACHING_ASSIGNMENT_ORDER: "UPDATE_TEACHING_ASSIGNMENT_ORDER",
	ADD_PREFERENCE: "ADD_PREFERENCE",
	REMOVE_PREFERENCE: "REMOVE_PREFERENCE",
	ADD_TEACHING_CALL_COMMENT: "ADD_TEACHING_CALL_COMMENT",
	ADD_TEACHING_CALL_RESPONSE: "ADD_TEACHING_CALL_RESPONSE",
	UPDATE_TEACHING_CALL_RESPONSE: "UPDATE_TEACHING_CALL_RESPONSE",
	UPDATE_TEACHING_CALL_RECEIPT: "UPDATE_TEACHING_CALL_RECEIPT",
	PRETEND_SUBMIT_FORM: "PRETEND_SUBMIT_FORM",
	CONTACT_INSTRUCTORS: "CONTACT_INSTRUCTORS",
	ADD_INSTRUCTORS_TO_TEACHING_CALL: "ADD_INSTRUCTORS_TO_TEACHING_CALL",
	REMOVE_INSTRUCTOR_FROM_TEACHING_CALL: "REMOVE_INSTRUCTOR_FROM_TEACHING_CALL",
	CHANGE_TERM: "CHANGE_TERM",
	CALCULATE_INSTRUCTORS_IN_CALL: "CALCULATE_INSTRUCTORS_IN_CALL",
	CALCULATE_ELIGIBLE_INSTRUCTORS: "CALCULATE_ELIGIBLE_INSTRUCTORS",
	SELECT_INSTRUCTORS: "SELECT_INSTRUCTORS",
	CALCULATE_PENDING_EMAILS: "CALCULATE_PENDING_EMAILS",
	TOGGLE_LOCK: "TOGGLE_LOCK"
});

export default teachingCallApp;
