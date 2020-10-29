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
			maxChars: '<?',
			allowNegative: '<?',
			mode: '<?' // Options are 'number' (only allow characters 0-9), and 'currency' (currency style formatting and input enforcement)
		},
		link: function(scope, element) {
			scope.$watch('mode',function() {
				if (scope.mode && scope.mode == 'number') {
					scope.preventNegative();
				}
			});

			scope.preventNegative = function() {
				element.on('keydown', function (e) {
					// Unicode character codes that represent an actual key on the keyboard.
					var MINUS = 189;
					var NUMPAD_MINUS = 109;
					var ALT_MINUS = 173;

					if (!scope.allowNegative && (e.keyCode == MINUS || e.keyCode === NUMPAD_MINUS || e.keyCode === ALT_MINUS)) {
						scope.preventedInput = true;
						e.preventDefault();
					}
				});
			};

			scope.enforceNegative = function() {
				if (!scope.allowNegative || !scope.value) { return; }

				const isNegative = (scope.value[0] == "-");

				// Remove all instances of '-' from the input value
				scope.value = scope.value.replace(/-/g, "");

				if (isNegative) {
					scope.value = "-" + scope.value;
				}
			};

			// Main method triggered by template, handles filtering/update callback
			scope.updateInput = function() {
				scope.applyUpdate();
			};

			// Triggers the update function with default 500ms delay, or uses provided delay override
			scope.applyUpdate = function() {
				if (angular.isUndefined(scope.onUpdate)) { return; } // eslint-disable-line no-undef

				// skip update if input was blocked
				if (scope.preventedInput) {
					scope.preventedInput = false;
					return;
				}

				scope.delay = scope.updateDelay || 1000;
				$timeout.cancel(scope.timeOut);

				scope.timeOut = $timeout(scope.onUpdate, scope.delay);
			};

			scope.onBlur = function() {
				if (angular.isUndefined(scope.onUpdate)) { return; } // eslint-disable-line no-undef

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
