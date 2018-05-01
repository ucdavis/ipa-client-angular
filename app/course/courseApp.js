// Controllers
import CourseCtrl from './controllers/CourseCtrl.js';

// Services
import CourseActionCreators from './services/courseActionCreators.js';
import CourseService from './services/courseService.js';
import CourseStateService from './services/courseStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Directives
import assignTagTooltip from './directives/assignTagTooltip/assignTagTooltip.js';
import courseDetails from './directives/courseDetails/courseDetails.js';
import deleteCourseModal from './directives/deleteCourseModal/deleteCourseModal.js';
import massImportSummary from './directives/massImportSummary/massImportSummary.js';
import newCourse from './directives/newCourse/newCourse.js';
import sectionGroupDetails from './directives/sectionGroupDetails/sectionGroupDetails.js';
import censusChart from './directives/censusChart.js';
import courseTable from './directives/courseTable.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./templates/CourseCtrl.html'),
		controller: "CourseCtrl"
	})
	.when("/", {
		template: require('./templates/CourseCtrl.html'),
		controller: "CourseCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const courseApp = angular.module("courseApp", dependencies)
.config(config)
.controller('CourseCtrl', CourseCtrl)
.service('CourseActionCreators', CourseActionCreators)
.service('CourseService', CourseService)
.service('CourseStateService', CourseStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('AuthService', AuthService)
.directive('assignTagTooltip', assignTagTooltip)
.directive('courseDetails', courseDetails)
.directive('deleteCourseModal', deleteCourseModal)
.directive('massImportSummary', massImportSummary)
.directive('newCourse', newCourse)
.directive('sectionGroupDetails', sectionGroupDetails)
.directive('censusChart', censusChart)
.directive('courseTable', courseTable)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	NEW_COURSE: "NEW_COURSE",
	CREATE_COURSE: "CREATE_COURSE",
	REMOVE_COURSE: "REMOVE_COURSE",
	UPDATE_COURSE: "UPDATE_COURSE",
	GET_COURSE_CENSUS: "GET_COURSE_CENSUS",
	BEGIN_FETCH_CENSUS: "BEGIN_FETCH_CENSUS",
	ADD_SECTION_GROUP: "ADD_SECTION_GROUP",
	REMOVE_SECTION_GROUP: "REMOVE_SECTION_GROUP",
	UPDATE_SECTION_GROUP: "UPDATE_SECTION_GROUP",
	TOGGLE_TERM_FILTER: "TOGGLE_TERM_FILTER",
	CELL_SELECTED: "CELL_SELECTED",
	CLOSE_DETAILS: "CLOSE_DETAILS",
	CLOSE_NEW_COURSE_DETAILS: "CLOSE_NEW_COURSE_DETAILS",
	FETCH_SECTIONS: "FETCH_SECTIONS",
	BEGIN_FETCH_SECTIONS: "BEGIN_FETCH_SECTIONS",
	CREATE_SECTION: "CREATE_SECTION",
	UPDATE_SECTION: "UPDATE_SECTION",
	REMOVE_SECTION: "REMOVE_SECTION",
	UPDATE_TABLE_FILTER: "UPDATE_TABLE_FILTER",
	BEGIN_IMPORT_MODE: "BEGIN_IMPORT_MODE",
	END_IMPORT_MODE: "END_IMPORT_MODE",
	SEARCH_IMPORT_COURSES: "SEARCH_IMPORT_COURSES",
	BEGIN_SEARCH_IMPORT_COURSES: "BEGIN_SEARCH_IMPORT_COURSES",
	TOGGLE_IMPORT_COURSE: "TOGGLE_IMPORT_COURSE",
	IMPORT_COURSES: "IMPORT_COURSES",
	UPDATE_TAG_FILTERS: "UPDATE_TAG_FILTERS",
	TOGGLE_UNPUBLISHED_COURSES: "TOGGLE_UNPUBLISHED_COURSES",
	TOGGLE_SELECT_COURSE_ROW: "TOGGLE_SELECT_COURSE_ROW",
	SELECT_ALL_COURSE_ROWS: "SELECT_ALL_COURSE_ROWS",
	DESELECT_ALL_COURSE_ROWS: "DESELECT_ALL_COURSE_ROWS",
	OPEN_COURSE_DELETION_MODAL: "OPEN_COURSE_DELETION_MODAL",
	CLOSE_COURSE_DELETION_MODAL: "CLOSE_COURSE_DELETION_MODAL",
	DELETE_MULTIPLE_COURSES: "DELETE_MULTIPLE_COURSES",
	MASS_ASSIGN_TAGS: "MASS_ASSIGN_TAGS"
});

export default courseApp;
