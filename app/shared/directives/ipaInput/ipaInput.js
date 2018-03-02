sharedApp.directive("ipaInput", this.ipaInput = function ($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'ipaInput.html',
		replace: true,
		scope: {
			onUpdate: '&?', // If set, this callback function will be triggered 500ms after changes stop
			value: '=',
			readOnly: '=?', // Boolean
			placeHolder: '<?', // Default text when empty
			updateDelay: '<?', // If an update function has been specified it will default to 500ms delay, can override that here
			mode: '<?' // Options are 'number' (only allow characters 0-9), and 'currency' (currency style formatting and input enforcement)
		},
		link: function(scope, element, attrs) {

			scope.$watch('mode',function() {
				if (scope.mode && scope.mode == 'number') {
					scope.onlyAllowNumberInputs();
				}
			});

			// Limits input to: backspace, period, and 0-9.
			scope.onlyAllowNumberInputs = function() {
				element.on('keydown', function (e) {
					var PERIOD = 140;
					var BACK_SPACE = 8;

					if (scope.isNumericKeyCode(e.keyCode) == false
					&& e.keyCode != PERIOD
					&& e.keyCode != BACK_SPACE) {
						e.preventDefault();
					}
				});
			};

			// Returns true if keyCode falls within one of the two numeric ranges.
			scope.isNumericKeyCode = function (keyCode) {
				// Numbers on top of keyboard are keyCodes: 48 - 57
				// Numbers on keypad are keyCodes: 96 - 105
				return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
			};

			// Main method triggered by template, handles filtering/update callback
			scope.updateInput = function() {
				scope.applyUpdate();
			};

			// Triggers the update function with default 500ms delay, or uses provided delay override
			scope.applyUpdate = function() {
				if (angular.isUndefined(scope.onUpdate)) { return; }

				scope.delay = scope.updateDelay || 1000;
				$timeout.cancel(scope.timeOut);

				scope.timeOut = $timeout(scope.onUpdate, scope.delay);
			};

			scope.onBlur = function() {
				if (angular.isUndefined(scope.onUpdate)) { return; }

				// $timeout.cancel will return true if there was time remaining
				var needToUpdate = $timeout.cancel(scope.timeOut);

				if (needToUpdate) {
					scope.onUpdate();
				}
			};
		}
	};
});