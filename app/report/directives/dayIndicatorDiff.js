/**
 * example:
 * <day-indicator-diff></day-indicator-diff>
 */
reportApp.directive("dayIndicatorDiff", this.dayIndicatorDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'dayIndicatorDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addBannerToDoItem = function (section, activity) {
				reportActionCreators.addBannerToDoItem(section, "activities", activity, "dayIndicator");
			};
		}
	};
});
