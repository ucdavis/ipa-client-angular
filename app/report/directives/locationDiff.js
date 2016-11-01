/**
 * example:
 * <location-diff></location-diff>
 */
reportApp.directive("locationDiff", this.locationDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'locationDiff.html',
		replace: true
	};
});
