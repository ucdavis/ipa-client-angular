/**
 * example:
 * <section-diff></section-diff>
 */
reportApp.directive("sectionDiff", this.sectionDiff = function (reportActionCreators) {
	return {
		restrict: "A",
		templateUrl: 'sectionDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.addBannerToDoItem = function (property, subEntity, subProperty) {
				reportActionCreators.addBannerToDoItem(scope.section, property, subEntity, subProperty);
			};
		}
	};
});
