/**
 * example:
 * <crn-diff></crn-diff>
 */
reportApp.directive("crnDiff", this.crnDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'crnDiff.html'
	};
});
