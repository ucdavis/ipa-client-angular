budgetApp.directive("supportCostRow", this.supportCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportCostRow.html',
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
