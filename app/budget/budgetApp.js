window.budgetApp = angular.module("budgetApp", ["sharedApp", "ngRoute"]);

budgetApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "BudgetCtrl.html",
			controller: "BudgetCtrl",
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";