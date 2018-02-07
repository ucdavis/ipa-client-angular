sharedApp.directive('instructorTypeDropdown', function($window, $location, $routeParams, $rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorTypeDropdown.html',
		replace: true,
		scope: {
			instructorTypes: '<',
			instructorCost: '<'
		},
		link: function (scope, element, attrs) {
			scope.assignInstructorTypeAndCost = function (instructorType) {
				budgetActions.assignInstructorTypeAndCost(scope.instructorCost, instructorType.id);
			};
		}
	};
});