let stickyHeader = function() {
	return {
		restrict: 'C',
		link: function (scope, element, attrs) {
			// Check if a repeatEvery number was passed, otherwise default to 20
			var numRepeat = parseInt(attrs.repeatEvery);
			scope.repeatEvery = isNaN(numRepeat) ? 20 : numRepeat;

			// Method to make the header sticky if the browser supports it, returns false if not
			var makeSticky = function () {
				var values = ['-webkit-sticky', '-moz-sticky', '-ms-sticky', '-o-sticky'];
				for (var i = 0; i < values.length; i++) {
					element.find('thead').css('position', values[i]);
					if (element.find('thead').css('position') === values[i]) {
						return true;
					}
				}
				return false;
			};

			// If the browser does not support position: sticky, repeat header
			if (makeSticky() === false) {
				scope.$watch(function () {
					return element.find('thead > tr > th').length * element.find('tr:not(.cloned-header):visible').length;
				}, function () {
					element.find('tr.cloned-header').remove();

					var row = scope.repeatEvery;
					var tbodies = element.find('tbody').length;
					var selector;

					if (tbodies > 1) {
						selector = 'tbody';
					} else {
						selector = 'tbody tr';
					}

					var repetitions = Math.floor(element.find(selector + ':not(.cloned-header):visible').length / scope.repeatEvery);

					for (var i = 0; i < repetitions; i++) {
						var tr = element.find('thead tr').clone().css('background-color', '#eee').addClass('cloned-header');
						angular.element(element.find(selector).get(row - 1)).after(tr); // eslint-disable-line no-undef
						row += scope.repeatEvery;
					}
				});
			}
		}
	};
};

export default stickyHeader;
