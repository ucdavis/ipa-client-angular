// Controllers
import DeansOfficeReportCtrl from './deansOffice/deansOfficeReportCtrl.js';

// Services
import DeansOfficeReportActions from './deansOffice/services/deansOfficeReportActions.js';
import DeansOfficeReportReducers from './deansOffice/services/deansOfficeReportReducers.js';
import DeansOfficeReportService from './deansOffice/services/deansOfficeReportService.js';

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
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	GET_BUDGET: "GET_BUDGET",
	GET_COURSES: "GET_COURSES",
	GET_SECTION_GROUPS: "GET_SECTION_GROUPS",
	GET_SECTIONS: "GET_SECTIONS",
	GET_INSTRUCTOR_TYPES: "GET_INSTRUCTOR_TYPES",
	GET_TEACHING_ASSIGNMENTS: "GET_TEACHING_ASSIGNMENTS",
	CALCULATE_VIEW: "CALCULATE_VIEW",
	INITIAL_FETCH_COMPLETE: "INITIAL_FETCH_COMPLETE"
});

export default reportsApp;
