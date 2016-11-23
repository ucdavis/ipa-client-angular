/**
 * example:
 * <tr section-diff></tr>
 */
reportApp.directive("sectionDiff", this.sectionDiff = function (reportActionCreators) {
	return {
		restrict: "A",
		templateUrl: 'sectionDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.toggleBannerToDoItem = function (property, childUniqueKey, childProperty) {
				reportActionCreators.createBannerToDoItem(scope.section.id, property, childUniqueKey, childProperty);
			};

			scope.setActiveChangeAction = function (actionKey, event) {
				// Prevent click event from going up to parent divs like activity or section
				event.stopPropagation(); debugger;

				if (scope.view.activeChangeAction == actionKey) {
					scope.view.activeChangeAction = '';
				} else {
					scope.view.activeChangeAction = actionKey;
				}
			};

			scope.deleteSection = function (section) {
				reportActionCreators.deleteSection(section);
			};
		}
	};
});
