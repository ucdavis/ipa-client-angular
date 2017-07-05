/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("lineItems", this.lineItems = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'lineItems.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
