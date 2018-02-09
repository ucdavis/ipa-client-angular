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
			scope.updateInstructorCost = function (instructorCost) {
				if (instructorCost.id > 0) {
					budgetActions.updateInstructorCost(instructorCost);
				} else {
					budgetActions.createInstructorCost(instructorCost);
				}
			};
		}
	};
});
