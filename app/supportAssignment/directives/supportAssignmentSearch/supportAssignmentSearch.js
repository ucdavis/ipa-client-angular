let supportAssignmentSearch = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./supportAssignmentSearch.html'),
		replace: true,
		scope: {},
		link: function (scope, element, attrs) {
			scope.searchQuery = "";

			scope.filterTable = function() {
				supportActions.updateTableFilter(scope.searchQuery);
			};
		}
	};
};

export default supportAssignmentSearch;
