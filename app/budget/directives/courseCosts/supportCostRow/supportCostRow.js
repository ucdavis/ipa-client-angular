budgetApp.directive("supportCostRow", this.supportCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportCostRow.html',
		replace: true,
		scope: {
			sectionGroupCost: '<'
		},
		link: function (scope, element, attrs) {

		} // end link
	};
});
