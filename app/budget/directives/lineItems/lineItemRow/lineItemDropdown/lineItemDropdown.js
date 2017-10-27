budgetApp.directive("lineItemDropdown", this.lineItemDropdown = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'lineItemDropdown.html',
		replace: true,
		scope: {
			lineItem: '<'
		},
		link: function (scope, element, attrs) {
			// Intetionally blank
		} // end link
	};
});
