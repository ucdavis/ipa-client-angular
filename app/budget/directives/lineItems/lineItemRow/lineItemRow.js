/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("lineItemRow", this.lineItemRow = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'lineItemRow.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
