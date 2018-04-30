/**
 * Colorpicker input directive
 * Example: <colorpicker type="text" color="my.model" />
 */
let colorpicker = function ($timeout) {
	return {
		restrict: "E",
		template: "<div class=\"input-group\"> " +
		"		<input type=\"text\" class=\"form-control\" ng-model=\"color\" > " +
		"		<div class=\"input-group-addon\"> " +
		"			<i class=\"color-preview\"></i> " +
		"		</div> " +
		"	</div> ",
		replace: true,
		scope: {
			color: '=',
			onChange: '&'
		},
		link: function (scope, element, attrs) {
			element.find('input').on('focus', function () {
				element.colorpicker('show');
			});

			element
				.colorpicker({
					format: 'hex',
					color: scope.color
				})
				.on('hidePicker.colorpicker', function (e) {
					var newColor = e.color.toHex();
					applyNewColor(newColor);
					applyChange();
				});

			var applyNewColor = function (newColor) {
				$timeout(function () {
					scope.color = newColor;
					scope.$apply();
				});
			};

			var applyChange = function () {
				$timeout(function () {
					scope.onChange();
					scope.$apply();
				});
			};
		}
	};
};

export default colorpicker;
