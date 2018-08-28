// CSS
import './budget.css';

// Controllers
import BudgetCtrl from './budgetCtrl.js';

// Services
import BudgetActions from './services/actions/budgetActions.js';
import BudgetCalculations from './services/actions/budgetCalculations.js';
import BudgetReducers from './services/budgetReducers.js';
import BudgetSelectors from './services/budgetSelectors.js';
import BudgetService from './services/budgetService.js';
import ScheduleCostCalculations from './services/actions/scheduleCostCalculations';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';
import SectionService from './../shared/services/SectionService.js';

// Directives
import budgetNav from './directives/budgetNav/budgetNav.js';
import lineItemFilters from './directives/budgetNav/lineItemFilters/lineItemFilters.js';
import courseListFilters from './directives/budgetNav/courseListFilters/courseListFilters.js';

import budgetScenarioToolbar from './directives/budgetScenarioToolbar/budgetScenarioToolbar.js';
import budgetScenarioDropdown from './directives/budgetScenarioToolbar/budgetScenarioDropdown/budgetScenarioDropdown.js';
import lineItems from './directives/lineItems/lineItems.js';
import lineItemDropdown from './directives/lineItems/lineItemDropdown/lineItemDropdown.js';
import budgetSummary from './directives/budgetSummary/budgetSummary.js';
import instructorList from './directives/instructorList/instructorList.js';
import courseList from './directives/courseList/courseList.js';

import budgetCosts from './directives/budgetCosts/budgetCosts.js';
import courseCostsRow from './directives/budgetCosts/courseCostsRow/courseCostsRow.js';
import instructorCostsRow from './directives/budgetCosts/instructorCostsRow/instructorCostsRow.js';
import instructorAssignmentDropdown from './directives/budgetCosts/instructorCostsRow/instructorAssignmentDropdown/instructorAssignmentDropdown.js';

import addBudgetScenario from './directives/modals/addBudgetScenario/addBudgetScenario.js';
import addCourseComments from './directives/modals/addCourseComments/addCourseComments.js';
import addLineItem from './directives/modals/addLineItem/addLineItem.js';
import addLineItemComments from './directives/modals/addLineItemComments/addLineItemComments.js';

import addCourse from './directives/modals/addCourse/addCourse.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./BudgetCtrl.html'),
		controller: "BudgetCtrl",
		resolve: {
			validate: function (AuthService, $route, BudgetActions) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						BudgetActions.getInitialState();
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
const budgetApp = angular.module("budgetApp", dependencies)
.config(config)
.controller('BudgetCtrl', BudgetCtrl)
.service('BudgetActions', BudgetActions)
.service('BudgetCalculations', BudgetCalculations)
.service('BudgetReducers', BudgetReducers)
.service('BudgetSelectors', BudgetSelectors)
.service('BudgetService', BudgetService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.service('AuthService', AuthService)
.service('ScheduleCostCalculations', ScheduleCostCalculations)
.service('SectionService', SectionService)
.directive('budgetNav', budgetNav)
.directive('lineItemFilters', lineItemFilters)
.directive('courseListFilters', courseListFilters)
.directive('budgetScenarioToolbar', budgetScenarioToolbar)
.directive('budgetScenarioDropdown', budgetScenarioDropdown)
.directive('budgetCosts', budgetCosts)
.directive('courseCostsRow', courseCostsRow)
.directive('instructorCostsRow', instructorCostsRow)
.directive('instructorAssignmentDropdown', instructorAssignmentDropdown)
.directive('lineItems', lineItems)
.directive('lineItemDropdown', lineItemDropdown)
.directive('budgetSummary', budgetSummary)
.directive('instructorList', instructorList)
.directive('addBudgetScenario', addBudgetScenario)
.directive('addCourseComments', addCourseComments)
.directive('addCourse', addCourse)
.directive('addLineItem', addLineItem)
.directive('addLineItemComments', addLineItemComments)
.directive('courseList', courseList)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	CREATE_BUDGET_SCENARIO: "CREATE_BUDGET_SCENARIO",
	DELETE_BUDGET_SCENARIO: "DELETE_BUDGET_SCENARIO",
	UPDATE_BUDGET_SCENARIO: "UPDATE_BUDGET_SCENARIO",
	CREATE_LINE_ITEM: "CREATE_LINE_ITEM",
	UPDATE_LINE_ITEM: "UPDATE_LINE_ITEM",
	DELETE_LINE_ITEM: "DELETE_LINE_ITEM",
	DELETE_LINE_ITEMS: "DELETE_LINE_ITEMS",
	UPDATE_BUDGET: "UPDATE_BUDGET",
	CREATE_SECTION_GROUP_COST_COMMENT: "CREATE_SECTION_GROUP_COST_COMMENT",
	CREATE_LINE_ITEM_COMMENT: "CREATE_LINE_ITEM_COMMENT",
	CREATE_SECTION_GROUP_COST: "CREATE_SECTION_GROUP_COST",
	UPDATE_SECTION_GROUP_COST: "UPDATE_SECTION_GROUP_COST",
	CREATE_INSTRUCTOR_TYPE_COST: "CREATE_INSTRUCTOR_TYPE_COST",
	UPDATE_INSTRUCTOR_TYPE_COST: "UPDATE_INSTRUCTOR_TYPE_COST",
	CREATE_INSTRUCTOR_COST: "CREATE_INSTRUCTOR_COST",
	UPDATE_INSTRUCTOR_COST: "UPDATE_INSTRUCTOR_COST",
	OPEN_ADD_LINE_ITEM_MODAL: "OPEN_ADD_LINE_ITEM_MODAL",
	CLOSE_ADD_LINE_ITEM_MODAL: "CLOSE_ADD_LINE_ITEM_MODAL",
	OPEN_ADD_COURSE_COMMENT_MODAL: "OPEN_ADD_COURSE_COMMENT_MODAL",
	CLOSE_ADD_COURSE_COMMENT_MODAL: "CLOSE_ADD_COURSE_COMMENT_MODAL",
	TOGGLE_ADD_BUDGET_SCENARIO_MODAL: "TOGGLE_ADD_BUDGET_SCENARIO_MODAL",
	OPEN_ADD_LINE_ITEM_COMMENT_MODAL: "OPEN_ADD_LINE_ITEM_COMMENT_MODAL",
	CLOSE_BUDGET_CONFIG_MODAL: "CLOSE_BUDGET_CONFIG_MODAL",
	OPEN_BUDGET_CONFIG_MODAL: "OPEN_BUDGET_CONFIG_MODAL",
	SELECT_BUDGET_SCENARIO: "SELECT_BUDGET_SCENARIO",
	SELECT_TERM: "SELECT_TERM",
	TOGGLE_SELECT_LINE_ITEM: "TOGGLE_SELECT_LINE_ITEM",
	SELECT_ALL_LINE_ITEMS: "SELECT_ALL_LINE_ITEMS",
	DESELECT_ALL_LINE_ITEMS: "DESELECT_ALL_LINE_ITEMS",
	SET_ROUTE: "SET_ROUTE",
	TOGGLE_FILTER_LINE_ITEM_SHOW_HIDDEN: "TOGGLE_FILTER_LINE_ITEM_SHOW_HIDDEN",
	CALCULATE_SCENARIO_TERMS: "CALCULATE_SCENARIO_TERMS",
	CALCULATE_SECTION_GROUPS: "CALCULATE_SECTION_GROUPS",
	CALCULATE_TOTAL_COST: "CALCULATE_TOTAL_COST",
	CALCULATE_INSTRUCTOR_TYPE_COSTS: "CALCULATE_INSTRUCTOR_TYPE_COSTS",
	CALCULATE_INSTRUCTORS: "CALCULATE_INSTRUCTORS",
	CALCULATE_LINE_ITEMS: "CALCULATE_LINE_ITEMS",
	CALCULATE_SUMMARY_TOTALS: "CALCULATE_SUMMARY_TOTALS",
	CALCULATE_SCHEDULE_COSTS: "CALCULATE_SCHEDULE_COSTS",
	CALCULATE_COURSE_LIST: "CALCULATE_COURSE_LIST",
	TOGGLE_FILTER_SHOW_HIDDEN_COURSES: "TOGGLE_FILTER_SHOW_HIDDEN_COURSES",
	SELECT_FUNDS_NAV: "SELECT_FUNDS_NAV",
  OPEN_ADD_COURSE_MODAL: "OPEN_ADD_COURSE_MODAL"
});

export default budgetApp;
