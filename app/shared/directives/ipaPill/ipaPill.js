sharedApp.directive("ipaPill", this.ipaPill = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaPill.html',
		replace: true,
		scope: {
			canDelete: '<?',
			onDelete: '&?',
			text: '<?'
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});