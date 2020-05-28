import './css/assignments.css';
import './css/teaching-call-modal.css';

// Controllers
import AssignmentCtrl from './controllers/AssignmentCtrl.js';

// Services
import AssignmentActionCreators from './services/assignmentActionCreators.js';
import AssignmentService from './services/assignmentService.js';
import AssignmentStateService from './services/assignmentStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import InstructorTypeService from './../shared/services/InstructorTypeService.js';

// Directives
import courseAssignmentTable from './directives/courseAssignmentTable.js';
import instructorAssignmentTable from './directives/instructorAssignmentTable.js';
import commentModal from './directives/modals/commentModal/commentModal.js';
import unavailabilityModal from './directives/modals/unavailabilityModal/unavailabilityModal.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./templates/AssignmentCtrl.html'),
		controller: "AssignmentCtrl",
		reloadOnSearch: false,
		resolve: {
			validate: function (AuthService, $route, AssignmentActionCreators) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
							var hasAccess = AuthService.getCurrentUser().hasAccess(['academicPlanner', 'reviewer'], $route.current.params.workgroupId);

							if (hasAccess) {
								return AssignmentActionCreators.getInitialState();
							} else {
								return { noAccess: true };
							}
					}
				});
			}
		}
	})
	.when("/", {
		template: require('./templates/AssignmentCtrl.html'),
		controller: "AssignmentCtrl",
		resolve: {
			validate: function (AuthService) {
				return AuthService.validate();
			}
		}
	})
	.otherwise({
		redirectTo: "/"
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const assignmentApp = angular.module("assignmentApp", dependencies) // eslint-disable-line no-undef
.config(config)
.controller('AssignmentCtrl', AssignmentCtrl)
.service('AssignmentActionCreators', AssignmentActionCreators)
.service('AssignmentService', AssignmentService)
.service('AssignmentStateService', AssignmentStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('InstructorTypeService', InstructorTypeService)

.directive('courseAssignmentTable', courseAssignmentTable)
.directive('instructorAssignmentTable', instructorAssignmentTable)
.directive('commentModal', commentModal)
.directive('unavailabilityModal', unavailabilityModal)
.constant('ActionTypes', {
	INIT_ASSIGNMENT_VIEW: "INIT_ASSIGNMENT_VIEW",
	ADD_TEACHING_ASSIGNMENT: "ADD_TEACHING_ASSIGNMENT",
	UPDATE_TEACHING_ASSIGNMENT: "UPDATE_TEACHING_ASSIGNMENT",
	REMOVE_TEACHING_ASSIGNMENT: "REMOVE_TEACHING_ASSIGNMENT",
	ADD_SCHEDULE_INSTRUCTOR_NOTE: "ADD_SCHEDULE_INSTRUCTOR_NOTE",
	UPDATE_SCHEDULE_INSTRUCTOR_NOTE: "UPDATE_SCHEDULE_INSTRUCTOR_NOTE",
	ADD_TEACHING_CALL_RESPONSE: "ADD_TEACHING_CALL_RESPONSE",
	UPDATE_TEACHING_CALL_RESPONSE: "UPDATE_TEACHING_CALL_RESPONSE",
	UPDATE_TEACHING_CALL_RECEIPT: "UPDATE_TEACHING_CALL_RECEIPT",
	CREATE_PLACEHOLDER_STAFF: "CREATE_PLACEHOLDER_STAFF",
	REMOVE_PLACEHOLDER_STAFF: "REMOVE_PLACEHOLDER_STAFF",
	ASSIGN_ASSOCIATE_INSTRUCTOR: "ASSIGN_ASSOCIATE_INSTRUCTOR",
	SWITCH_MAIN_VIEW: "SWITCH_MAIN_VIEW",
	TOGGLE_TERM_FILTER: "TOGGLE_TERM_FILTER",
	UPDATE_TABLE_FILTER: "UPDATE_TABLE_FILTER",
	UPDATE_TAG_FILTERS: "UPDATE_TAG_FILTERS",
	TOGGLE_UNPUBLISHED_COURSES: "TOGGLE_UNPUBLISHED_COURSES",
	TOGGLE_COMPLETED_INSTRUCTORS: "TOGGLE_COMPLETED_INSTRUCTORS",
	UPDATE_COURSE_NOTE: "UPDATE_COURSE_NOTE",
	UPDATE_INSTRUCTOR_NOTE: "UPDATE_INSTRUCTOR_NOTE"
});

export default assignmentApp;
