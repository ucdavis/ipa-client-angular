/**
 * example:
 * <seats-diff></seats-diff>
 */
reportApp.directive("seatsDiff", this.seatsDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'seatsDiff.html'
	};
});
