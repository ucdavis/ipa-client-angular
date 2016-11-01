/**
 * example:
 * <section-diff></section-diff>
 */
reportApp.directive("sectionDiff", this.sectionDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'sectionDiff.html',
		replace: true
	};
});
