/**
 * example:
 * <crn-diff></crn-diff>
 */
registrarReconciliationReportApp.directive("crnDiff", this.crnDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'crnDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.updateCrn = function (sectionId, crn) {
				var section = {
					id: scope.section.id,
					crn: crn
				};
				reportActionCreators.updateSection(section, 'crn', scope.section.uniqueKey);
			};
		}
	};
});
