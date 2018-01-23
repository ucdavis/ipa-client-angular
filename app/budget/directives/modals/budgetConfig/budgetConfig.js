budgetApp.directive("budgetConfig", this.budgetConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'budgetConfig.html',
		replace: true,
		scope: {
			state: '<',
			budget: '<',
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
});
