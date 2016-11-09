/**
 * example:
 * <end-time-diff></end-time-diff>
 */
reportApp.directive("endTimeDiff", this.endTimeDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'endTimeDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addBannerToDoItem = function (section, activity) {
				reportActionCreators.addBannerToDoItem(section, "activities", activity, "endTime");
			};
		}
	};
});
