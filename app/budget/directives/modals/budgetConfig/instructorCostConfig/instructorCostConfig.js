import './instructorCostConfig.css';

let instructorCostConfig = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./instructorCostConfig.html'),
		replace: true,
		scope: {
			instructors: '<',
			instructorTypes: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateInstructorCost = function (instructorCost) {
				if (instructorCost.id > 0) {
					BudgetActions.updateInstructorCost(instructorCost);
				} else {
					BudgetActions.createInstructorCost(instructorCost);
				}
			};
		}
	};
};

export default instructorCostConfig;
