// Shared
import StringService from './../shared/services/StringService.js';
import SchService from './../shared/services/SchService.js';

// Controllers
import BudgetComparisonReportCtrl from './budgetComparison/budgetComparisonReportCtrl.js';

// Services
import BudgetComparisonReportActions from './budgetComparison/services/budgetComparisonReportActions.js';
import BudgetComparisonReportReducers from './budgetComparison/services/budgetComparisonReportReducers.js';
import BudgetComparisonReportService from './budgetComparison/services/budgetComparisonReportService.js';
import BudgetComparisonReportCalculations from './budgetComparison/services/budgetComparisonReportCalculations.js';
import BudgetComparisonReportExcelService from './budgetComparison/services/budgetComparisonReportExcelService.js';

// Directives
import budgetScenarioSelector from './budgetComparison/directives/budgetScenarioSelector/budgetScenarioSelector.js';
import courseCosts from './budgetComparison/directives/courseCosts/courseCosts.js';
import courseCostChanges from './budgetComparison/directives/courseCostChanges/courseCostChanges.js';
import supportAndFunds from './budgetComparison/directives/supportAndFunds/supportAndFunds.js';
import supportAndFundChanges from './budgetComparison/directives/supportAndFundChanges/supportAndFundChanges.js';
import miscStats from './budgetComparison/directives/miscStats/miscStats.js';
import miscStatChanges from './budgetComparison/directives/miscStatChanges/miscStatChanges.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/budgetComparisonReport", {
		template: require('./budgetComparison/budgetComparisonReportCtrl.html'),
		controller: 'BudgetComparisonReportCtrl',
		resolve: {
			validate: function (AuthService, $route, BudgetComparisonReportActions) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						var hasAccess = AuthService.getCurrentUser().hasAccess('academicPlanner', $route.current.params.workgroupId);

						if (hasAccess) {
							return BudgetComparisonReportActions.getInitialState();
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
const reportsApp = angular.module("reportsApp", dependencies) // eslint-disable-line no-undef
                          .controller('BudgetComparisonReportCtrl', BudgetComparisonReportCtrl)
                          .service('BudgetComparisonReportActions', BudgetComparisonReportActions)
                          .service('BudgetComparisonReportReducers', BudgetComparisonReportReducers)
                          .service('BudgetComparisonReportService', BudgetComparisonReportService)
                          .service('BudgetComparisonReportCalculations', BudgetComparisonReportCalculations)
                          .service('BudgetComparisonReportExcelService', BudgetComparisonReportExcelService)
                          .service('StringService', StringService)
                          .service('SchService', SchService)
                          .directive('courseCosts', courseCosts)
                          .directive('courseCostChanges', courseCostChanges)
                          .directive('miscStats', miscStats)
                          .directive('miscStatChanges', miscStatChanges)
                          .directive('supportAndFunds', supportAndFunds)
                          .directive('supportAndFundChanges', supportAndFundChanges)
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
