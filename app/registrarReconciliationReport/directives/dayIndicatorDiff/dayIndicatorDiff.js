/**
 * example:
 * <day-indicator-diff></day-indicator-diff>
 */
let dayIndicatorDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./dayIndicatorDiff.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateDayIndicator = function (dayIndicator) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					dayIndicator: dayIndicator
				};
				RegistrarReconciliationReportActionCreators.updateActivity(activity, 'dayIndicator');
			};
		}
	};
};

export default dayIndicatorDiff;