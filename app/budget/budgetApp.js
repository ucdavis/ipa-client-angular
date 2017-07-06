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

/* UI manipulation actions */
var TOGGLE_LINE_ITEM_SECTION = "TOGGLE_LINE_ITEM_SECTION";
var TOGGLE_COURSE_COST_SECTION = "TOGGLE_COURSE_COST_SECTION";
var TOGGLE_LINE_ITEM = "TOGGLE_LINE_ITEM";