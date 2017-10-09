budgetApp.directive("tableSorter", this.tableSorter = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'tableSorter.html',
		replace: true,
		scope: {
			property: '<',
			isActive: '<',
			descending: '<'
		},
		link: function (scope, element, attrs) {
			scope.sortByProperty = function() {
				budgetActions.sortLineItems(scope.property, true);
			};

			scope.sortAscending = function() {
				budgetActions.sortLineItems(scope.property, false);
			};

			scope.sortDescending = function() {
				budgetActions.sortLineItems(scope.property, true);
			};
		} // end link
	};
});
