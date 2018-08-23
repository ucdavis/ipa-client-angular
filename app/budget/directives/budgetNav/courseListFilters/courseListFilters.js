import './courseListFilters.css';

let courseListFilters = function(BudgetActions) {
	return {
		restrict: 'E',
		template: require('./courseListFilters.html'),
		replace: true,
		scope: {
			filters: '<' // Expected to have 'description' and 'selected' properties
		},
		link: function (scope, element, attrs) {
			scope.isDropdownOpen = false;

			scope.toggleCourseListFilterDropdown = function() {
				scope.isDropdownOpen = !scope.isDropdownOpen;
			};

			scope.closeCourseListFilterDropdown = function() {
				scope.isDropdownOpen = false;
			};

			scope.toggleCourseListFilter = function(filter) {
				BudgetActions.toggleCourseListFilter(filter);
			};
		}
	};
};

export default courseListFilters;
