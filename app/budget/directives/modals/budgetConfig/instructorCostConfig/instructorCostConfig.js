budgetApp.directive("instructorCostConfig", this.instructorCostConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorCostConfig.html',
		replace: true,
		scope: {
			instructors: '<',
			instructorTypes: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateInstructorCost = function (newInstructor) {
				budgetActions.updateInstructorCost(newInstructor);
			};
		}
	};
});
