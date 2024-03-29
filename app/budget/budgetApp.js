// CSS
import "./budget.css";

// Controllers
import BudgetCtrl from "./budgetCtrl.js";

// Services
import BudgetActions from "./services/actions/budgetActions.js";
import BudgetCalculations from "./services/actions/budgetCalculations.js";
import BudgetReducers from "./services/budgetReducers.js";
import BudgetSelectors from "./services/budgetSelectors.js";
import BudgetExcelService from "./services/budgetExcelService.js";
import BudgetService from "./services/budgetService.js";
import ScheduleCostCalculations from "./services/actions/scheduleCostCalculations";

// Shared services
import ApiService from "./../shared/services/ApiService.js";
import TermService from "./../shared/services/TermService.js";
import AuthService from "./../shared/services/AuthService.js";
import SectionService from "./../shared/services/SectionService.js";
import DwService from "./../shared/services/DwService.js";
import CourseService from "./../shared/services/CourseService.js";

// Directives
import budgetNav from "./directives/budgetNav/budgetNav.js";
import lineItemFilters from "./directives/budgetNav/lineItemFilters/lineItemFilters.js";

import budgetScenarioToolbar from "./directives/budgetScenarioToolbar/budgetScenarioToolbar.js";
import budgetScenarioDropdown from "./directives/budgetScenarioToolbar/budgetScenarioDropdown/budgetScenarioDropdown.js";
import lineItems from "./directives/lineItems/lineItems.js";
import lineItemDropdown from "./directives/lineItems/lineItemDropdown/lineItemDropdown.js";
import budgetSummary from "./directives/budgetSummary/budgetSummary.js";
import instructorList from "./directives/instructorList/instructorList.js";
import courseList from "./directives/courseList/courseList.js";

import budgetCosts from './directives/budgetCosts/budgetCosts.js';
import budgetCostsPrint from './directives/budgetCosts/budgetCostsPrint/budgetCostsPrint.js';
import courseCostsRow from './directives/budgetCosts/courseCostsRow/courseCostsRow.js';
import instructorCosts from './directives/budgetCosts/instructorCosts/instructorCosts.js';
import addInstructorCost from './directives/budgetCosts/addInstructorCost/addInstructorCost.js';
import addInstructorAssignmentDropdown from './directives/budgetCosts/addInstructorCost/addInstructorAssignmentDropdown/addInstructorAssignmentDropdown.js';
import editInstructorAssignmentDropdown from './directives/budgetCosts/instructorCosts/editInstructorAssignmentDropdown/editInstructorAssignmentDropdown.js';

import addBudgetScenario from "./directives/modals/addBudgetScenario/addBudgetScenario.js";
import addCourseComments from "./directives/modals/addCourseComments/addCourseComments.js";
import addLineItem from "./directives/modals/addLineItem/addLineItem.js";
import addLineItemComments from "./directives/modals/addLineItemComments/addLineItemComments.js";
import downloadBudgetScenarios from "./directives/modals/downloadBudgetScenarios/downloadBudgetScenarios.js";

import addCourse from "./directives/modals/addCourse/addCourse.js";
import expenseItems from "./directives/expenseItems/expenseItems";
import addExpenseItem from "./directives/modals/addExpenseItem/addExpenseItem";
import expenseItemDropdown from "./directives/expenseItems/expenseItemDropdown/expenseItemDropdown.js";

// Dependencies
var dependencies = ["sharedApp", "ngRoute"];

// Config
function config($routeProvider) {
  return $routeProvider
    .when("/:workgroupId/:year", {
      template: require("./BudgetCtrl.html"),
      controller: "BudgetCtrl",
      resolve: {
        validate: function (AuthService, $route, BudgetActions) {
          return AuthService.validate().then(function () {
            if ($route.current.params.workgroupId) {
              if ($route.current.params.workgroupId) {
                var hasAccess = AuthService.getCurrentUser().hasAccess(
                  "academicPlanner",
                  $route.current.params.workgroupId
                );

                if (hasAccess) {
                  return BudgetActions.getInitialState();
                } else {
                  return { noAccess: true };
                }
              }
            }
          });
        }
      }
    })
    .otherwise({
      redirectTo: "/"
    });
}

config.$inject = ["$routeProvider"];

// App declaration
const budgetApp = angular // eslint-disable-line no-undef
  .module("budgetApp", dependencies)
  .config(config)
  .controller("BudgetCtrl", BudgetCtrl)
  .service("BudgetActions", BudgetActions)
  .service("BudgetCalculations", BudgetCalculations)
  .service("BudgetReducers", BudgetReducers)
  .service("BudgetSelectors", BudgetSelectors)
  .service("BudgetExcelService", BudgetExcelService)
  .service("BudgetService", BudgetService)
  .service("ApiService", ApiService)
  .service("TermService", TermService)
  .service("AuthService", AuthService)
  .service("DwService", DwService)
  .service("ScheduleCostCalculations", ScheduleCostCalculations)
  .service("SectionService", SectionService)
  .service("CourseService", CourseService)
  .directive("budgetNav", budgetNav)
  .directive("lineItemFilters", lineItemFilters)
  .directive("budgetScenarioToolbar", budgetScenarioToolbar)
  .directive("budgetScenarioDropdown", budgetScenarioDropdown)
  .directive("budgetCosts", budgetCosts)
  .directive("courseCostsRow", courseCostsRow)
  .directive("instructorCosts", instructorCosts)
  .directive("addInstructorCost", addInstructorCost)
  .directive("addInstructorAssignmentDropdown", addInstructorAssignmentDropdown)
  .directive("editInstructorAssignmentDropdown", editInstructorAssignmentDropdown)
  .directive("expenseItems", expenseItems)
  .directive("lineItems", lineItems)
  .directive("lineItemDropdown", lineItemDropdown)
  .directive("expenseItemDropdown", expenseItemDropdown)
  .directive("budgetSummary", budgetSummary)
  .directive("instructorList", instructorList)
  .directive("addBudgetScenario", addBudgetScenario)
  .directive("addCourseComments", addCourseComments)
  .directive("addCourse", addCourse)
  .directive("addExpenseItem", addExpenseItem)
  .directive("addLineItem", addLineItem)
  .directive("addLineItemComments", addLineItemComments)
  .directive("courseList", courseList)
  .directive("budgetCostsPrint", budgetCostsPrint)
  .directive("downloadBudgetScenarios", downloadBudgetScenarios)
  .constant("ActionTypes", {
    INIT_STATE: "INIT_STATE",
    CREATE_BUDGET_SCENARIO: "CREATE_BUDGET_SCENARIO",
    DELETE_BUDGET_SCENARIO: "DELETE_BUDGET_SCENARIO",
    UPDATE_BUDGET_SCENARIO: "UPDATE_BUDGET_SCENARIO",
    APPROVE_BUDGET_REQUEST: "APPROVE_BUDGET_REQUEST",
    CREATE_LINE_ITEM: "CREATE_LINE_ITEM",
    UPDATE_LINE_ITEM: "UPDATE_LINE_ITEM",
    UPDATE_LINE_ITEMS: "UPDATE_LINE_ITEMS",
    DELETE_LINE_ITEM: "DELETE_LINE_ITEM",
    DELETE_LINE_ITEMS: "DELETE_LINE_ITEMS",
    CREATE_EXPENSE_ITEM: "CREATE_EXPENSE_ITEM",
    UPDATE_EXPENSE_ITEM: "UPDATE_EXPENSE_ITEM",
    DELETE_EXPENSE_ITEM: "DELETE_EXPENSE_ITEM",
    DELETE_EXPENSE_ITEMS: "DELETE_EXPENSE_ITEMS",
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
    OPEN_ADD_EXPENSE_ITEM_MODAL: "OPEN_ADD_EXPENSE_ITEM_MODAL",
    CLOSE_ADD_EXPENSE_ITEM_MODAL: "CLOSE_ADD_EXPENSE_ITEM_MODAL",
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
    TOGGLE_SELECT_EXPENSE_ITEM: "TOGGLE_SELECT_EXPENSE_ITEM",
    SELECT_ALL_EXPENSE_ITEMS: "SELECT_ALL_EXPENSE_ITEMS",
    DESELECT_ALL_EXPENSE_ITEMS: "DESELECT_ALL_EXPENSE_ITEMS",
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
    SELECT_FUNDS_NAV: "SELECT_FUNDS_NAV",
    OPEN_ADD_COURSE_MODAL: "OPEN_ADD_COURSE_MODAL",
    UPDATE_COURSE_TAG: "UPDATE_COURSE_TAG",
    UPDATE_SYNC_STATUS: "UPDATE_SYNC_STATUS",
    TOGGLE_DOWNLOAD_BUDGET_SCENARIOS: "TOGGLE_DOWNLOAD_BUDGET_SCENARIOS",
    CREATE_SECTION_GROUP_COST_INSTRUCTOR: "CREATE_SECTION_GROUP_COST_INSTRUCTOR",
    UPDATE_SECTION_GROUP_COST_INSTRUCTOR: "UPDATE_SECTION_GROUP_COST_INSTRUCTOR",
    DELETE_SECTION_GROUP_COST_INSTRUCTOR: "DELETE_SECTION_GROUP_COST_INSTRUCTOR"
  });

export default budgetApp;
