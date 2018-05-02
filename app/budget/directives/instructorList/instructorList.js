budgetApp.directive("instructorList", this.instructorList = function (budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'instructorList.html',
		replace: true,
		scope: {
			state: '<',
			selectedBudgetScenario: '<'
		},
		link: function (scope, element, attrs) {
			scope.view = {
				activeTab: 'Instructor Costs',
				allTabs: ['Instructor Costs', 'Group Costs']
			};

			scope.setActiveTab = function (activeTab) {
				scope.view.activeTab = activeTab;
			};
		}
	};
});
