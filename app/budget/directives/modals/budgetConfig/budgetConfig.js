import './budgetConfig.css';

let budgetConfig = function () {
	return {
		restrict: 'E',
		template: require('./budgetConfig.html'),
		replace: true,
		scope: {
			state: '<',
			selectedBudgetScenario: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.close = function() {
				scope.isVisible = false;
			};
		}
	};
};

export default budgetConfig;
