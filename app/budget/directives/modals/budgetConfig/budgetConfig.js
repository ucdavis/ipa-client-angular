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
			scope.view = {
				activeTab: "General",
				allTabs: ["General", "Group Cost", "Instructor Cost"]
			};

			scope.close = function() {
				scope.isVisible = false;
			};

			scope.setActiveTab = function(tabName) {
				scope.view.activeTab = tabName;
			};
		}
	};
};

export default budgetConfig;
