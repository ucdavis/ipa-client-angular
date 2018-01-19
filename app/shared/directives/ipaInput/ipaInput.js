sharedApp.directive("ipaInput", this.ipaInput = function ($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'ipaInput.html',
		replace: true,
		scope: {
			onUpdate: '&?', // If set, this callback function will be triggered 500ms after changes stop
			value: '=',
			readOnly: '=?',
			placeHolder: '<?',
			updateDelay: '<?'
		},
		link: function(scope, element, attrs) {
			element.unbind("keydown keyup");

			element.bind("keyup", function (event) {
				if (angular.isUndefined(scope.onUpdate)) { return; }

				scope.delay = scope.onUpdate || 500;

				$timeout.cancel(scope.timeOut);
				
				scope.timeOut = $timeout(scope.onUpdate, scope.delay);
			});
		}
	};
});