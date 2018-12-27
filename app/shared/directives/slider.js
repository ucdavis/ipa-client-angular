let slider = function () {
	return {
		restrict: "AE",
		scope: {
			sliderValue: '=',
			sliderMin: '=',
			sliderMax: '=',
			sliderStep: '='
		},
		template: "<div class=\"slider\"></div>" +
		"< input type=\"number\" class=\"slider-label\" ng-model=\"sliderValue\" " +
		"max=\"{{sliderMax}}\" min=\"{{sliderMin}}\" step=\"{{sliderStep}}\" />",
		link: function (scope, element) {
			scope.$watch('sliderValue', function () {
				$('.slider', element).slider({ // eslint-disable-line no-undef
					value: scope.sliderValue,
					min: scope.sliderMin,
					max: scope.sliderMax,
					step: scope.sliderStep,
					slide: function (event, ui) {
						scope.sliderValue = ui.value;
						$('.slider-label', element).val(scope.sliderValue); // eslint-disable-line no-undef
					}
				});
			});
		}
	};
};

export default slider;
