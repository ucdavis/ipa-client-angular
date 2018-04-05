instructionalSupportApp.directive("studentAvailabilities", this.studentAvailabilities = function () {
	return {
		restrict: 'E',
		templateUrl: 'studentAvailabilities.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
