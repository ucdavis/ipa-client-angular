/**
 * example:
 * <day-indicator-diff></day-indicator-diff>
 */
reportApp.directive("dayIndicatorDiff", this.dayIndicatorDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'dayIndicatorDiff.html',
		replace: true
	};
});
