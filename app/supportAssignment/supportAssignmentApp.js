// Controllers
import SupportAssignmentCtrl from './controllers/SupportAssignmentCtrl.js';

// Services
import SupportActions from './services/supportActions.js';
import SupportService from './services/supportService.js';
import SupportReducer from './services/supportReducer.js';
import SupportSelectors from './services/supportSelectors.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Directives
import viewAvailabilityModal from './directives/modals/viewAvailabilityModal/viewAvailabilityModal.js';
import reviewTools from './directives/modals/reviewTools/reviewTools.js';
import supportAssignmentSearch from './directives/modals/supportAssignmentSearch/supportAssignmentSearch.js';
import supportAssignmentToolbar from './directives/modals/supportAssignmentToolbar/supportAssignmentToolbar.js';
import supportAssignmentTable from './directives/modals/supportAssignmentTable/supportAssignmentTable.js';
import supportAssignmentRow from './directives/modals/supportAssignmentTable/supportAssignmentRow/supportAssignmentRow.js';
import supportStaffTab from './directives/modals/supportAssignmentTable/supportStaffTab/supportStaffTab.js';
import staffRow from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffRow.js';
import staffComments from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffComments/staffComments.js';
import staffHeader from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffHeader/staffHeader.js';
import appointmentInput from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffHeader/appointmentInput/appointmentInput.js';
import staffPreferences from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffPreferences/staffPreferences.js';
import assignCourse from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffPreferences/assignCourse/assignCourse.js';
import preferenceDisplayRow from './directives/modals/supportAssignmentTable/supportStaffTab/staffRow/staffPreferences/preferenceDisplayRow/preferenceDisplayRow.js';
import supportCoursesTab from './directives/modals/supportAssignmentTable/supportCoursesTab/supportCoursesTab.js';
import assignSupportStaff from './directives/modals/supportAssignmentTable/supportCoursesTab/assignSupportStaff/assignSupportStaff.js';
import courseHeader from './directives/modals/supportAssignmentTable/supportCoursesTab/courseHeader/courseHeader.js';
import courseAppointmentInput from './directives/modals/supportAssignmentTable/supportCoursesTab/courseHeader/courseAppointmentInput/courseAppointmentInput.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		templateUrl: "supportAssignmentCtrl.html",
		controller: "SupportAssignmentCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});
};

config.$inject = ['$routeProvider'];

// App declaration
const supportAssignmentApp = angular.module("supportAssignmentApp", dependencies)
.config(config)
.controller('SupportAssignmentCtrl', SupportAssignmentCtrl)
.service('SupportActions', SupportActions)
.service('SupportService', SupportService)
.service('SupportReducer', SupportReducer)
.service('SupportSelectors', SupportSelectors)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('AuthService', AuthService)
.directive('viewAvailabilityModal', viewAvailabilityModal)
.directive('reviewTools', reviewTools)
.directive('supportAssignmentSearch', supportAssignmentSearch)
.directive('supportAssignmentToolbar', supportAssignmentToolbar)
.directive('supportAssignmentTable', supportAssignmentTable)
.directive('supportAssignmentRow', supportAssignmentRow)
.directive('supportStaffTab', supportStaffTab)
.directive('staffRow', staffRow)
.directive('staffComments', staffComments)
.directive('staffHeader', staffHeader)
.directive('appointmentInput', appointmentInput)
.directive('staffPreferences', staffPreferences)
.directive('assignCourse', assignCourse)
.directive('preferenceDisplayRow', preferenceDisplayRow)
.directive('supportCoursesTab', supportCoursesTab)
.directive('assignSupportStaff', assignSupportStaff)
.directive('courseHeader', courseHeader)
.directive('courseAppointmentInput', courseAppointmentInput)
.constant('ActionTypes', {
	UPDATE_TABLE_FILTER: "UPDATE_TABLE_FILTER",
	SET_VIEW_PIVOT: "SET_VIEW_PIVOT",
	SET_VIEW_TYPE: "SET_VIEW_TYPE",
	SET_SUPPORT_STAFF_TAB: "SET_SUPPORT_STAFF_TAB",
	OPEN_AVAILABILITY_MODAL: "OPEN_AVAILABILITY_MODAL",
	CLOSE_AVAILABILITY_MODAL: "CLOSE_AVAILABILITY_MODAL",
	SET_READ_ONLY_MODE: "SET_READ_ONLY_MODE",
	
	INIT_STATE: "INIT_STATE",
	UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW: "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW",
	UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW: "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW",
	DELETE_ASSIGNMENT: "DELETE_ASSIGNMENT",
	UPDATE_SECTIONGROUP: "UPDATE_SECTIONGROUP",
	ASSIGN_STAFF_TO_SECTION_GROUP: "ASSIGN_STAFF_TO_SECTION_GROUP",
	ASSIGN_STAFF_TO_SECTION: "ASSIGN_STAFF_TO_SECTION",
	UPDATE_SUPPORT_APPOINTMENT: "UPDATE_SUPPORT_APPOINTMENT",
	
	CALCULATE_SECTION_SCHEDULING: "CALCULATE_SECTION_SCHEDULING",
	CALCULATE_SECTION_GROUP_SCHEDULING: "CALCULATE_SECTION_GROUP_SCHEDULING",
	CALCULATE_SCHEDULE_CONFLICTS: "CALCULATE_SCHEDULE_CONFLICTS",
	CALCULATE_STAFF_ASSIGNMENT_OPTIONS: "CALCULATE_STAFF_ASSIGNMENT_OPTIONS"
	});

export default supportAssignmentApp;
