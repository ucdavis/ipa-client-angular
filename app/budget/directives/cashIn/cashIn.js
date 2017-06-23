/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("cashIn", this.cashIn = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'cashIn.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
