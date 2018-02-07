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
			scope.assignInstructorType = function (instructorType) {
				budgetActions.assignInstructorType(instructorCost);
			};
		}
	};
});