sharedApp.directive("ipaInput", this.ipaInput = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaInput.html',
		replace: true,
		scope: {
			onUpdate: '&?',
			value: '='
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});