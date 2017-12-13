supportAssignmentApp.directive("supportAssignmentSearch", this.supportAssignmentSearch = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportAssignmentSearch.html',
		replace: true,
		scope: {},
		link: function (scope, element, attrs) {
			// intentionally empty
		}
	};
});
