/**
 * example:
 * <section-diff></section-diff>
 */
reportApp.directive("sectionDiff", this.sectionDiff = function () {
	return {
		restrict: "A",
		templateUrl: 'sectionDiff.html',
		replace: true
	};
});
