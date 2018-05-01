import './lineItemFilters.css';

let lineItemFilters = function(BudgetActions) {
	return {
		restrict: 'E',
		template: require('./lineItemFilters.html'),
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
				BudgetActions.toggleLineItemFilter(filter);
			};
		}
	};
};

export default lineItemFilters;
