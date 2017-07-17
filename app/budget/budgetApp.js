window.budgetApp = angular.module("budgetApp", ["sharedApp", "ngRoute"]);

budgetApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "BudgetCtrl.html",
			controller: "BudgetCtrl",
			resolve: {
				validate: BudgetCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
var CREATE_BUDGET_SCENARIO = "CREATE_BUDGET_SCENARIO";
var DELETE_BUDGET_SCENARIO = "DELETE_BUDGET_SCENARIO";
var CREATE_LINE_ITEM = "CREATE_LINE_ITEM";
var UPDATE_LINE_ITEM = "UPDATE_LINE_ITEM";
var DELETE_LINE_ITEM = "DELETE_LINE_ITEM";
var UPDATE_BUDGET = "UPDATE_BUDGET";
var UPDATE_SECTION_GROUP_COST= "UPDATE_SECTION_GROUP_COST";

/* UI manipulation actions */
var TOGGLE_LINE_ITEM_SECTION = "TOGGLE_LINE_ITEM_SECTION";
var TOGGLE_COURSE_COST_SECTION = "TOGGLE_COURSE_COST_SECTION";
var TOGGLE_LINE_ITEM = "TOGGLE_LINE_ITEM";
var TOGGLE_LINE_ITEM_DETAIL = "TOGGLE_LINE_ITEM_DETAIL";
var TOGGLE_SECTION_GROUP_COST_DETAIL = "TOGGLE_SECTION_GROUP_COST_DETAIL";
var SELECT_BUDGET_SCENARIO = "SELECT_BUDGET_SCENARIO";
var SELECT_TERM = "SELECT_TERM";