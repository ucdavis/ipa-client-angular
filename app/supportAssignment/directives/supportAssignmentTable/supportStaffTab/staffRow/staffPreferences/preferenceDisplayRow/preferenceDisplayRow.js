supportAssignmentApp.directive("preferenceDisplayRow", this.preferenceDisplayRow = function () {
	return {
		restrict: 'E',
		templateUrl: 'preferenceDisplayRow.html',
		replace: true,
		scope: {
			text: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});
