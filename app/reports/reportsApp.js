// Shared
import StringService from './../shared/services/StringService.js';

// Controllers
import DeansOfficeReportCtrl from './deansOffice/deansOfficeReportCtrl.js';

// Services
import DeansOfficeReportActions from './deansOffice/services/deansOfficeReportActions.js';
import DeansOfficeReportReducers from './deansOffice/services/deansOfficeReportReducers.js';
import DeansOfficeReportService from './deansOffice/services/deansOfficeReportService.js';
import DeansOfficeReportCalculations from './deansOffice/services/deansOfficeReportCalculations.js';

// Directives
import changeTable from './deansOffice/directives/changeTable/changeTable.js';
import yearTable from './deansOffice/directives/yearTable/yearTable.js';
import budgetScenarioSelector from './deansOffice/directives/budgetScenarioSelector/budgetScenarioSelector.js';

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
                          .service('StringService', StringService)
                          .directive('yearTable', yearTable)
                          .directive('changeTable', changeTable)
                          .directive('budgetScenarioSelector', budgetScenarioSelector)
                          .config(config)
                          .constant('ActionTypes', {
                            INIT_STATE: "INIT_STATE",
                            GET_USERS: "GET_USERS",
                            GET_USER_ROLES: "GET_USER_ROLES",
                            GET_INSTRUCTORS: "GET_INSTRUCTORS",
                            GET_CURRENT_BUDGET: "GET_CURRENT_BUDGET",
                            GET_CURRENT_COURSES: "GET_CURRENT_COURSES",
                            GET_CURRENT_SECTION_GROUPS: "GET_CURRENT_SECTION_GROUPS",
                            GET_CURRENT_SECTIONS: "GET_CURRENT_SECTIONS",
                            GET_CURRENT_INSTRUCTOR_TYPES: "GET_CURRENT_INSTRUCTOR_TYPES",
                            GET_CURRENT_TEACHING_ASSIGNMENTS: "GET_CURRENT_TEACHING_ASSIGNMENTS",
                            GET_CURRENT_LINE_ITEM_CATEGORIES: "GET_CURRENT_LINE_ITEM_CATEGORIES",
                            GET_CURRENT_LINE_ITEMS: "GET_CURRENT_LINE_ITEMS",
                            GET_CURRENT_BUDGET_SCENARIOS: "GET_CURRENT_BUDGET_SCENARIOS",
                            GET_PREVIOUS_BUDGET: "GET_PREVIOUS_BUDGET",
                            GET_PREVIOUS_COURSES: "GET_PREVIOUS_COURSES",
                            GET_PREVIOUS_SECTION_GROUPS: "GET_PREVIOUS_SECTION_GROUPS",
                            GET_PREVIOUS_SECTIONS: "GET_PREVIOUS_SECTIONS",
                            GET_PREVIOUS_INSTRUCTOR_TYPES: "GET_PREVIOUS_INSTRUCTOR_TYPES",
                            GET_PREVIOUS_TEACHING_ASSIGNMENTS: "GET_PREVIOUS_TEACHING_ASSIGNMENTS",
                            GET_PREVIOUS_LINE_ITEM_CATEGORIES: "GET_PREVIOUS_LINE_ITEM_CATEGORIES",
                            GET_PREVIOUS_LINE_ITEMS: "GET_PREVIOUS_LINE_ITEMS",
                            GET_PREVIOUS_BUDGET_SCENARIOS: "GET_PREVIOUS_BUDGET_SCENARIOS",
                            GET_CURRENT_INSTRUCTOR_TYPE_COSTS: "GET_CURRENT_INSTRUCTOR_TYPE_COSTS",
                            GET_PREVIOUS_INSTRUCTOR_TYPE_COSTS: "GET_PREVIOUS_INSTRUCTOR_TYPE_COSTS",
                            GET_CURRENT_INSTRUCTOR_COSTS: "GET_CURRENT_INSTRUCTOR_COSTS",
                            GET_PREVIOUS_INSTRUCTOR_COSTS: "GET_PREVIOUS_INSTRUCTOR_COSTS",
                            GET_PREVIOUS_SECTION_GROUP_COSTS: "GET_PREVIOUS_SECTION_GROUP_COSTS",
                            GET_CURRENT_SECTION_GROUP_COSTS: "GET_CURRENT_SECTION_GROUP_COSTS",
                            CALCULATE_VIEW: "CALCULATE_VIEW",
                            CURRENT_YEAR_FETCH_COMPLETE: "CURRENT_YEAR_FETCH_COMPLETE",
                            PREVIOUS_YEAR_FETCH_COMPLETE: "PREVIOUS_YEAR_FETCH_COMPLETE",
                            SELECT_CURRENT_BUDGET_SCENARIO: "SELECT_CURRENT_BUDGET_SCENARIO",
                            SELECT_PREVIOUS_BUDGET_SCENARIO: "SELECT_PREVIOUS_BUDGET_SCENARIO"
                          });

export default reportsApp;
