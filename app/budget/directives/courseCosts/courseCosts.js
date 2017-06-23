/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {

		} // end link
	};
});
