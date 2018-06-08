// Controllers
import InstructorSupportCallFormCtrl from './instructorSupportCallForm/controllers/instructorSupportCallFormCtrl.js';
import StudentSupportCallFormCtrl from './studentSupportCallForm/StudentSupportCallFormCtrl.js';

// Services
import InstructorFormActions from './instructorSupportCallForm/services/instructorFormActions.js';
import InstructorFormSelectors from './instructorSupportCallForm/services/instructorFormSelectors.js';
import InstructorFormService from './instructorSupportCallForm/services/instructorFormService.js';
import InstructorFormStateService from './instructorSupportCallForm/services/instructorFormStateService.js';
import StudentFormActions from './studentSupportCallForm/services/studentFormActions.js';
import StudentFormReducers from './studentSupportCallForm/services/studentFormReducers.js';
import StudentFormSelectors from './studentSupportCallForm/services/studentFormSelectors.js';
import StudentFormService from './studentSupportCallForm/services/studentFormService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';
import DwService from './../shared/services/DwService.js';

// Directives
import instructorPreferenceSelector from './instructorSupportCallForm/directives/instructorPreferenceSelector/instructorPreferenceSelector.js';
import confirmEligible from './studentSupportCallForm/directives/confirmEligible/confirmEligible.js';
import modalPreferenceComments from './studentSupportCallForm/directives/modalPreferenceComments/modalPreferenceComments.js';
import studentAvailabilities from './studentSupportCallForm/directives/studentAvailabilities/studentAvailabilities.js';
import crnAvailable from './studentSupportCallForm/directives/studentAvailabilities/crnAvailable/crnAvailable.js';
import gridAvailable from './studentSupportCallForm/directives/studentAvailabilities/gridAvailable/gridAvailable.js';
import studentComments from './studentSupportCallForm/directives/studentComments/studentComments.js';
import studentFormReview from './studentSupportCallForm/directives/studentFormReview/studentFormReview.js';
import studentPreferences from './studentSupportCallForm/directives/studentPreferences/studentPreferences.js';
import studentPreferenceTable from './studentSupportCallForm/directives/studentPreferences/studentPreferenceTable/studentPreferenceTable.js';
import studentPreferenceSelector from './studentSupportCallForm/directives/studentPreferences/studentPreferenceTable/studentPreferenceSelector/studentPreferenceSelector.js';

import studentQualifications from './studentSupportCallForm/directives/studentQualifications/studentQualifications.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode/instructorSupportCallForm", {
		template: require('./instructorSupportCallForm/InstructorSupportCallForm.html'),
		controller: "InstructorSupportCallFormCtrl",
		resolve: {
			validate: function (AuthService, $route, InstructorFormActions) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						InstructorFormActions.getInitialState();
					}
				});
			}
		}
	})
	.when("/:workgroupId/:year/:termShortCode/studentSupportCallForm", {
		template: require('./studentSupportCallForm/StudentSupportCallForm.html'),
		controller: "StudentSupportCallFormCtrl",
		resolve: {
			validate: function (AuthService, $route, StudentFormActions) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						StudentFormActions.getInitialState();
					}
				});
			}
		}
	})
	.otherwise({
		redirectTo: "/"
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const instructionalSupportApp = angular.module("instructionalSupportApp", dependencies)
.config(config)
.controller('InstructorSupportCallFormCtrl', InstructorSupportCallFormCtrl)
.controller('StudentSupportCallFormCtrl', StudentSupportCallFormCtrl)
.service('InstructorFormActions', InstructorFormActions)
.service('InstructorFormSelectors', InstructorFormSelectors)
.service('InstructorFormService', InstructorFormService)
.service('InstructorFormStateService', InstructorFormStateService)
.service('StudentFormActions', StudentFormActions)
.service('StudentFormReducers', StudentFormReducers)
.service('StudentFormSelectors', StudentFormSelectors)
.service('StudentFormService', StudentFormService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('AuthService', AuthService)
.service('DwService', DwService)
.directive('instructorPreferenceSelector', instructorPreferenceSelector)
.directive('confirmEligible', confirmEligible)
.directive('modalPreferenceComments', modalPreferenceComments)
.directive('studentAvailabilities', studentAvailabilities)
.directive('crnAvailable', crnAvailable)
.directive('gridAvailable', gridAvailable)
.directive('studentComments', studentComments)
.directive('studentFormReview', studentFormReview)
.directive('studentPreferences', studentPreferences)
.directive('studentPreferenceTable', studentPreferenceTable)
.directive('studentPreferenceSelector', studentPreferenceSelector)
.directive('studentQualifications', studentQualifications)
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
	ASSIGN_STAFF_TO_SECTION_GROUP_SLOT: "ASSIGN_STAFF_TO_SECTION_GROUP_SLOT",
	OPEN_PREFERENCE_COMMENT_MODAL: "OPEN_PREFERENCE_COMMENT_MODAL",
	CLOSE_PREFERENCE_COMMENT_MODAL: "CLOSE_PREFERENCE_COMMENT_MODAL",
	CALCULATE_TIMESLOTS_FOR_CRN: "CALCULATE_TIMESLOTS_FOR_CRN",
	CALCULATE_FORM_VALID: "CALCULATE_FORM_VALID",
	BEGIN_FETCH_ACTIVITIES_BY_CRN: "BEGIN_FETCH_ACTIVITIES_BY_CRN",
	COMPLETE_FETCH_ACTIVITIES_BY_CRN: "COMPLETE_FETCH_ACTIVITIES_BY_CRN",
	CLEAR_CRN_SEARCH: "CLEAR_CRN_SEARCH"
});

export default instructionalSupportApp;
