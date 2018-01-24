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
			mode: '<?' // Options are 'number' (only allow characters 0-9)
		},
		link: function(scope, element, attrs) {
			// Main method triggered by template, handles filtering/update callback
			scope.updateInput = function() {
				scope.filterValue();
				scope.applyUpdate();
			};

			// Triggers the update function with default 500ms delay, or uses provided delay override
			scope.applyUpdate = function() {
				if (angular.isUndefined(scope.onUpdate)) { return; }

				scope.delay = scope.onUpdate || 500;
				$timeout.cancel(scope.timeOut);

				scope.timeOut = $timeout(scope.onUpdate, scope.delay);
			};

			// Determines the filters to be applied to input value based on specified mode (no filtering by default)
			scope.filterValue = function() {
				if (scope.mode == "number") {
					var validCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

					scope.value = scope.limitToValidCharacters(scope.value, validCharacters);
				}
			};

			// Generates a filtered string based on provided constraints
			scope.limitToValidCharacters = function(inputValue, validCharacters) {
				if (inputValue == null || inputValue == undefined) { return inputValue; }

				var filteredValue = "";

				for (var i = 0; i < inputValue.length; i++) {
					var char = inputValue[i];
					if (validCharacters.indexOf(char) > -1) {
						filteredValue += char;
					}
				}

				return filteredValue ? filteredValue : null;
			};
		}
	};
});