/**
 * example:
 * <crn-diff></crn-diff>
 */
reportApp.directive("crnDiff", this.crnDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'crnDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.updateCrn = function (sectionId, crn) {
				var section = {
					id: sectionId,
					crn: crn
				};
				reportActionCreators.updateSection(section, 'crn');
			};
		}
	};
});
