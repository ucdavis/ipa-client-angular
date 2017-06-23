/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("cashOut", this.cashOut = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'cashOut.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
