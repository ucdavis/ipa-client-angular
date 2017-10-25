budgetApp.directive("courseCostRow", this.courseCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCostRow.html',
		replace: true,
		scope: {
			sectionGroupCost: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateSectionGroupCost = function(sectionGroupCost, propertyName) {
				budgetActions.toggleSectionGroupCostDetail(sectionGroupCost.id, propertyName);
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.displayProperty = function(sectionGroupCost, propertyName) {
				budgetActions.toggleSectionGroupCostDetail(sectionGroupCost.id, propertyName);
			};

		} // end link
	};
});
