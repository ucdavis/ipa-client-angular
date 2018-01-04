sharedApp.directive("ipaToggle", this.ipaToggle = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaToggle.html',
		replace: true,
		scope: {
			isActive: '<',
			onClick: '&?',
			inactiveText: '<?',
			activeText: '<?'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
});