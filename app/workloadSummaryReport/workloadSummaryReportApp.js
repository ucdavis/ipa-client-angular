// Directives
import workloadTable from './directives/workloadTable/workloadTable.js';
import workloadTotals from './directives/workloadTotals/workloadTotals.js';

// Services
import WorkloadSummaryActions from './services/WorkloadSummaryActions.js';
import WorkloadSummaryReducers from './services/WorkloadSummaryReducers.js';
import WorkloadSummaryService from './services/WorkloadSummaryService.js';

// Shared services
import TermService from './../shared/services/TermService.js';
import DwService from './../shared/services/DwService.js';
import InstructorTypeService from './../shared/services/InstructorTypeService.js';

// Controllers
import WorkloadSummaryReportCtrl from './workloadSummaryReportCtrl.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./workloadSummaryReportCtrl.html'),
		controller: 'WorkloadSummaryReportCtrl'
	})
	.otherwise({
		redirectTo: function () {
			window.location = "/not-found.html";
		}
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const workloadSummaryReportApp = angular.module("workloadSummaryReportApp", dependencies)
.directive('workloadTable', workloadTable)
.directive('workloadTotals', workloadTotals)
.controller('WorkloadSummaryReportCtrl', WorkloadSummaryReportCtrl)
.service('WorkloadSummaryActions', WorkloadSummaryActions)
.service('WorkloadSummaryReducers', WorkloadSummaryReducers)
.service('WorkloadSummaryService', WorkloadSummaryService)
.service('TermService', TermService)
.service('DwService', DwService)
.service('InstructorTypeService', InstructorTypeService)
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	GET_COURSES: "GET_COURSES",
	GET_TEACHING_ASSIGNMENTS: "GET_TEACHING_ASSIGNMENTS",
	GET_INSTRUCTORS: "GET_INSTRUCTORS",
	GET_INSTRUCTOR_TYPES: "GET_INSTRUCTOR_TYPES",
	GET_SECTION_GROUPS: "GET_SECTION_GROUPS",
	GET_USERS: "GET_USERS",
	GET_USER_ROLES: "GET_USER_ROLES",
	GET_CALCULATIONS: "GET_CALCULATIONS",
	GET_SECTIONS: "GET_SECTIONS",
	CALCULATE_VIEW: "CALCULATE_VIEW",
	BEGIN_CENSUS_DATA_FETCH: "BEGIN_CENSUS_DATA_FETCH",
	INITIAL_FETCH_COMPLETE: "INITIAL_FETCH_COMPLETE"
});

export default workloadSummaryReportApp;
