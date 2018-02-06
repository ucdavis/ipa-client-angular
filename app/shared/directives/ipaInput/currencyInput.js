/**
	Helper directive used by ipaInput for handling currency rendering/parsing
**/
sharedApp.directive("currencyInput", this.currencyInput = function ($filter, $parse) {
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function (scope, element, attrs, ngModel) {

			scope.$watch('mode',function() {
				if (scope.mode && scope.mode == 'currency') {
					scope.initializeInput();
				}
			});

			scope.parse = function(viewValue, noRender) {
				if (!viewValue) {
					return viewValue;
				}

				// Strips out anything that isn't a number or period
				var clean = viewValue.toString().replace(/[^0-9.]+/g, '').replace(/\.{2,}/, '.');

				// Handle multiple periods in the number
				var dotSplit = clean.split('.');
				if (dotSplit.length > 2) {
					clean = dotSplit[0] + '.' + dotSplit[1].slice(0, 2);
				} else if (dotSplit.length == 2) {
					clean = dotSplit[0] + '.' + dotSplit[1].slice(0, 2);
				}

				if (!noRender) {
					ngModel.$render();
				}

				return clean;
			};

			scope.initializeInput = function() {
				ngModel.$parsers.unshift(scope.parse);

				ngModel.$render = function() {
					scope.render();
				};

				scope.render();
			};

			scope.render = function() {
				var clean = scope.parse(ngModel.$viewValue, true);

				if (!clean) {
					return;
				}

				var currencyValue, dotSplit = clean.split('.');

				if (clean[clean.length - 1] === '.') {
					currencyValue = '$' + $filter('number')(parseFloat(clean)) + '.';
				} else if (clean.indexOf('.') != -1 && dotSplit[dotSplit.length - 1].length == 1) {
					currencyValue = '$' + $filter('number')(parseFloat(clean), 1);
				} else if (clean.indexOf('.') != -1 && dotSplit[dotSplit.length - 1].length == 1) {
					currencyValue = '$' + $filter('number')(parseFloat(clean), 2);
				} else {
					currencyValue = '$' + $filter('number')(parseFloat(clean));
				}

				element.val(currencyValue);
			};
		}
	};
});