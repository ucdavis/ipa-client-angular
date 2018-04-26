// Controllers
import BudgetCtrl from './budgetCtrl.js';

// Services
import BudgetActions from './services/budgetActions.js';
import BudgetCalculations from './services/budgetCalculations.js';
import BudgetReducers from './services/budgetReducers.js';
import BudgetSelectors from './services/budgetSelectors.js';
import BudgetService from './services/budgetService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Directives
import assignTagTooltip from './directives/assignTagTooltip/assignTagTooltip.js';

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
		controller: "BudgetCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});
};

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
.directive('assignTagTooltip', assignTagTooltip)
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
	CALCULATE_LINE_ITEMS: "CALCULATE_LINE_ITEMS"
	});

export default budgetApp;



