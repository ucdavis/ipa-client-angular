/**
 * example:
 * <location-diff></location-diff>
 */
reportApp.directive("locationDiff", this.locationDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'locationDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addBannerToDoItem = function (section, activity) {
				reportActionCreators.addBannerToDoItem(section, "activities", activity, "location");
			};
		}
	};
});
