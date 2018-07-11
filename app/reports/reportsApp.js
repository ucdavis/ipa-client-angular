// Controllers
import DeansOfficeReportCtrl from './deansOffice/deansOfficeReportCtrl.js';

// Services
import DeansOfficeReportActions from './deansOffice/services/deansOfficeReportActions.js';
import DeansOfficeReportReducers from './deansOffice/services/deansOfficeReportReducers.js';
import DeansOfficeReportService from './deansOffice/services/deansOfficeReportService.js';
import DeansOfficeReportCalculations from './deansOffice/services/deansOfficeReportCalculations.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/deansOfficeReport", {
		template: require('./deansOffice/deansOfficeReportCtrl.html'),
		controller: 'DeansOfficeReportCtrl',
		resolve: {
			validate: function (AuthService, $route, DeansOfficeReportActions) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						DeansOfficeReportActions.getInitialState();
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
const reportsApp = angular.module("reportsApp", dependencies)
.controller('DeansOfficeReportCtrl', DeansOfficeReportCtrl)
.service('DeansOfficeReportActions', DeansOfficeReportActions)
.service('DeansOfficeReportReducers', DeansOfficeReportReducers)
.service('DeansOfficeReportService', DeansOfficeReportService)
.service('DeansOfficeReportCalculations', DeansOfficeReportCalculations)
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	GET_CURRENT_BUDGET: "GET_CURRENT_BUDGET",
	GET_CURRENT_COURSES: "GET_CURRENT_COURSES",
	GET_CURRENT_SECTION_GROUPS: "GET_CURRENT_SECTION_GROUPS",
	GET_CURRENT_SECTIONS: "GET_CURRENT_SECTIONS",
	GET_CURRENT_INSTRUCTOR_TYPES: "GET_CURRENT_INSTRUCTOR_TYPES",
	GET_CURRENT_TEACHING_ASSIGNMENTS: "GET_CURRENT_TEACHING_ASSIGNMENTS",
	GET_PREVIOUS_BUDGET: "GET_PREVIOUS_BUDGET",
	GET_PREVIOUS_COURSES: "GET_PREVIOUS_COURSES",
	GET_PREVIOUS_SECTION_GROUPS: "GET_PREVIOUS_SECTION_GROUPS",
	GET_PREVIOUS_SECTIONS: "GET_PREVIOUS_SECTIONS",
	GET_PREVIOUS_INSTRUCTOR_TYPES: "GET_PREVIOUS_INSTRUCTOR_TYPES",
	GET_PREVIOUS_TEACHING_ASSIGNMENTS: "GET_PREVIOUS_TEACHING_ASSIGNMENTS",
	CALCULATE_VIEW: "CALCULATE_VIEW",
	CURRENT_YEAR_FETCH_COMPLETE: "CURRENT_YEAR_FETCH_COMPLETE",
	PREVIOUS_YEAR_FETCH_COMPLETE: "PREVIOUS_YEAR_FETCH_COMPLETE"
});

export default reportsApp;
