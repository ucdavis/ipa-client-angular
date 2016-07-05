/**
 * Colorpicker input directive
 * Example: <colorpicker type="text" color="my.model" />
 */
sharedApp.directive("colorpicker", this.colorpicker = function () {
	return {
		restrict: "E",
		template: "<div class=\"input-group\"> " +
		"		<input type=\"text\" class=\"form-control\" ng-model=\"color\" > " +
		"		<div class=\"input-group-addon\"> " +
		"			<i class=\"color-preview\" ng-style=\"{ 'background-color': color }\"></i> " +
		"		</div> " +
		"	</div> ",
		replace: true,
		scope: {
			color: '=',
			onChange: '&'
		},
		link: function (scope, element, attrs) {
			element
				.colorpicker({
					format: 'hex'
				})
				.on('changeColor', function (e) {
					scope.color = e.color.toHex();
					scope.$apply();
				})
				.on('hidePicker', function (e) {
					scope.onChange();
					scope.$apply();
				});
		}
	}
})