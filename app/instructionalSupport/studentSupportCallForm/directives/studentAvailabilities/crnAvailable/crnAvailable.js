instructionalSupportApp.directive("crnAvailable", this.crnAvailable = function () {
	return {
		restrict: 'E',
		templateUrl: 'crnAvailable.html',
		replace: true,
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});