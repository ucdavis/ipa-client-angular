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