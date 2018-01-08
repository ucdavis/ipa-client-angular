supportAssignmentApp.directive("supportAssignmentSearch", this.supportAssignmentSearch = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportAssignmentSearch.html',
		replace: true,
		scope: {},
		link: function (scope, element, attrs) {
			scope.searchQuery = "";

			scope.filterTable = function() {
				supportActions.updateTableFilter(scope.searchQuery);
			};
		}
	};
});
