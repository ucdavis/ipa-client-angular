let ipaCurrencyInput = function() {
	return {
		restrict: 'E',
		template: require('./ipaCurrencyInput.html'),
		replace: true,
		scope: {},
		link: function (scope) {
			scope.previousInputValue = "";
			scope.inputValue = "";
			scope.indexOfPeriod = -1;

			scope.updateInput = function() {
				// Remove anything that isn't a number or period
				scope.inputValue = scope.inputValue.toString().match(/[0-9\.]/g); // eslint-disable-line no-useless-escape
				// If empty, set to zero, otherwise combine the regex results array into a string
				scope.inputValue = scope.inputValue ? scope.inputValue.join("") : "0";

				var index = scope.calculatePeriodIndex();

				scope.setPeriodLocation(index);
				scope.insertCommas();

				scope.previousInputValue = angular.copy(scope.inputValue); // eslint-disable-line no-undef
			};

			// Will identify the proper location for the period.
			// If multiple are found, will prefer to keep the same period in the previous version.
			scope.calculatePeriodIndex = function () {
				var periodIndexes = [];

				// Identify periods in string
				for (var i = 0; i < scope.inputValue.length; i++) {
					var c = scope.inputValue[i];
					if (c == ".") {
						periodIndexes.push(i);
					}
				}

				// No period found
				if (periodIndexes.length == 0) {
					return (-1);
				}

				// A single period is acceptable
				if (periodIndexes.length == 1) {
					return periodIndexes[0];
				}

				var matchesPrevious = periodIndexes.indexOf(scope.indexOfPeriod);

				// Prefer to use the same period if it still exists
				if (matchesPrevious > -1) {
					return scope.indexOfPeriod;
				}

				// As last resort, use the last period
				return periodIndexes[periodIndexes.length - 1];
			};

			scope.setPeriodLocation = function(index) {
				scope.indexOfPeriod = index;

				if (index == -1) {
					return;
				}
				// Remove all existing periods
				scope.inputValue = scope.inputValue.replace(/\./g, "");
				// Inject period
				if (index > -1) {
					scope.inputValue = scope.injectAtIndex(scope.inputValue, ".", index);
				}
			};

			scope.insertCommas = function() {
				var integerEndIndex = scope.indexOfPeriod > -1 ? scope.inputValue.indexOf(".") : scope.inputValue.length - 1;

				for (var i = 3; i <= integerEndIndex; i = i + 3) {
					var index = integerEndIndex - i;
					scope.inputValue = scope.injectAtIndex(scope.inputValue, ",", index);
				}
			};

			scope.injectAtIndex = function(string, char, index) {
				string = string.slice(0, index + 1) + char + string.slice(index + 1);
				return string;
			};
		}
	};
};

export default ipaCurrencyInput;
