/**
 * example:
 * <end-time-diff></end-time-diff>
 */
reportApp.directive("endTimeDiff", this.endTimeDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'endTimeDiff.html',
		replace: true
	};
});
