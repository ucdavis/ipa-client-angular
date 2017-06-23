/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("budgetSummary", this.budgetSummary = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'budgetSummary.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
