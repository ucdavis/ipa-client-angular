/**
 * example:
 * <day-indicator-diff></day-indicator-diff>
 */
reportApp.directive("dayIndicatorDiff", this.dayIndicatorDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'dayIndicatorDiff.html',
		replace: true
	};
});
