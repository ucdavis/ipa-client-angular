/**
 * example:
 * <start-time-diff></start-time-diff>
 */
reportApp.directive("startTimeDiff", this.startTimeDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'startTimeDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addBannerToDoItem = function (section, activity) {
				reportActionCreators.addBannerToDoItem(section, "activities", activity, "startTime");
			};
		}
	};
});
