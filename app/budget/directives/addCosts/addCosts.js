/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("addCosts", this.addCosts = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'addCosts.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
