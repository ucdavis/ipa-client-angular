/**
 * example:
 * <activity-diff></activity-diff>
 */
reportApp.directive("activityDiff", this.activityDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'activityDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addBannerToDoItem = function (section, activity, property) {
				reportActionCreators.addBannerToDoItem(section, "activities", activity, property);
			};
		}
	};
});
