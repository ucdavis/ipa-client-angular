instructionalSupportApp.directive("studentPreferences", this.studentPreferences = function () {
	return {
		restrict: 'E',
		templateUrl: 'studentPreferences.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
