/**
 * example:
 * <section-diff></section-diff>
 */
reportApp.directive("sectionDiff", this.sectionDiff = function () {
	return {
		restrict: "A",
		templateUrl: 'sectionDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];
		}
	};
});
