/**
 * example:
 * <crn-diff></crn-diff>
 */
let crnDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./crnDiff.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.updateCrn = function (sectionId, crn) {
				var section = {
					id: scope.section.id,
					crn: crn
				};
				RegistrarReconciliationReportActionCreators.updateSection(section, 'crn', scope.section.uniqueKey);
			};
		}
	};
};

export default crnDiff;