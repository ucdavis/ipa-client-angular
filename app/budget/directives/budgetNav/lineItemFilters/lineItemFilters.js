sharedApp.directive('lineItemFilters', function(budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'lineItemFilters.html',
		replace: true,
		scope: {
			filters: '<' // Expected to have 'description' and 'selected' properties
		},
		link: function (scope, element, attrs) {
			scope.isDropdownOpen = false;

			scope.toggleLineItemFilterDropdown = function() {
				scope.isDropdownOpen = !scope.isDropdownOpen;
			};

			scope.closeLineItemFilterDropdown = function() {
				scope.isDropdownOpen = false;
			};

			scope.toggleLineItemFilter = function(filter) {
				budgetActions.toggleLineItemFilter(filter);
			};
		}
	};
});
