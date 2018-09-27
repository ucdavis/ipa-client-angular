let timeEditor = function (ActivityService) {
	return {
		restrict: "E",
		template: require('./timeEditor.html'),
		link: function (scope, element, attrs) {
			scope.dayIndicatorToDayCodes = function (dayIndicator) {
				return ActivityService.dayIndicatorToDayCodes(dayIndicator);
			};
		}
	};
};

export default timeEditor;
