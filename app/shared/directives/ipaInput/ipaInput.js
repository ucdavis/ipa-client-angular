let ipaInput = function ($timeout) {
	return {
		restrict: 'E',
		template: require('./ipaInput.html'),
		replace: true,
		scope: {
			onUpdate: '&?', // If set, this callback function will be triggered 500ms after changes stop
			value: '=',
			readOnly: '=?', // Boolean (displays a disabled input box)
			labelReadOnly: '=?', // Similar to readOnly, but removes all borders/styles. Displays only number in proper position.
			placeHolder: '<?', // Default text when empty
			updateDelay: '<?', // If an update function has been specified it will default to 500ms delay, can override that here
			isInvalid: '<?',
			mode: '<?', // Options are 'number' (only allow characters 0-9), and 'currency' (currency style formatting and input enforcement)
			maxChars: '<?'
		},
		link: function(scope, element, attrs) {
			scope.$watch('mode',function() {
				if (scope.mode && scope.mode == 'number') {
					scope.onlyAllowNumberInputs();
				}
			});

			// Limits input to numbers and acceptable misc. keys
			scope.onlyAllowNumberInputs = function() {
				element.on('keydown', function (e) {
					// Unicode character codes that represent an actual key on the keyboard.
					var PERIOD = 190;
					var BACK_SPACE = 8;
					var LEFT_ARROW = 37;
					var RIGHT_ARROW = 39;

					var acceptableMiscValues = [
						PERIOD,
						BACK_SPACE,
						LEFT_ARROW,
						RIGHT_ARROW
					];

					if (scope.isNumericKeyCode(e.keyCode) == false
					&& (acceptableMiscValues.indexOf(e.keyCode) == -1)) {
						e.preventDefault();
					}
				});
			};

			// Returns true if keyCode falls within one of the two numeric ranges.
			scope.isNumericKeyCode = function (keyCode) {
				// Numbers on top of keyboard are keyCodes: 48 - 57
				var MIN_NUMBER_TOP_ROW_KEYCODE = 48;
				var MAX_NUMBER_TOP_ROW_KEYCODE = 57;
				// Numbers on keypad are keyCodes: 96 - 105
				var MIN_NUMBER_PAD_KEYCODE = 96;
				var MAX_NUMBER_PAD_KEYCODE = 105;

				var isTopRowNumber = (keyCode >= MIN_NUMBER_TOP_ROW_KEYCODE && keyCode <= MAX_NUMBER_TOP_ROW_KEYCODE);
				var isNumpadNumber = (keyCode >= MIN_NUMBER_PAD_KEYCODE && keyCode <= MAX_NUMBER_PAD_KEYCODE);

				return (isTopRowNumber || isNumpadNumber);
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
};

export default ipaInput;
