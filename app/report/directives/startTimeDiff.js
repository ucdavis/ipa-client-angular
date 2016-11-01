/**
 * example:
 * <start-time-diff></start-time-diff>
 */
reportApp.directive("startTimeDiff", this.startTimeDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'startTimeDiff.html',
		replace: true
	};
});
