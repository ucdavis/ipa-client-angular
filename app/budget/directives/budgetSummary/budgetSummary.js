import './budgetSummary.css';

let budgetSummary = function () {
	return {
		restrict: 'E',
		template: require('./budgetSummary.html'),
		replace: true,
		scope: {
			summary: '<',
			budget: '<'
		},
		link: function (scope, element, attrs) {
			scope.saveBudget = function () {
				budgetActions.updateBudget(scope.budget);
			};
		} // end link
	};
};

export default budgetSummary;
