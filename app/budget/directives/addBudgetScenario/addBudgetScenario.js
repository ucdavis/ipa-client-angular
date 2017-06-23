/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("addBudgetScenario", this.addBudgetScenario = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'addBudgetScenario.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
