sharedApp.directive("currencyInput", this.currencyInput = function ($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'currencyInput.html',
		replace: true,
		require: 'ngModel',
		scope: {
			onUpdate: '&?', // If set, this callback function will be triggered 500ms after changes stop
			value: '=',
			readOnly: '=?', // Boolean
			placeHolder: '<?', // Default text when empty
			updateDelay: '<?', // If an update function has been specified it will default to 500ms delay, can override that here
			mode: '<?' // Options are 'number' (only allow characters 0-9)
		},
		link: function(scope, element, attrs, ngModelCtrl) {
			// Main method triggered by template, handles update callback
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

			scope.applyFilters = function() {
				console.log("Formatter triggered!");
				ngModelCtrl.$formatters.push(function(value) {
					return value.toUpperCase();
				});
			};

			if (scope.mode == "currency") {
				scope.applyFilters();
			}

			ngModelCtrl.$render = function() {
				scope.unit = ngModelCtrl.$viewValue.unit;
				scope.num  = ngModelCtrl.$viewValue.num;
			};
		}
	};
});