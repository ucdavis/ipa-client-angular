/**
 * example:
 * <day-indicator-diff></day-indicator-diff>
 */
registrarReconciliationReportApp.directive("dayIndicatorDiff", this.dayIndicatorDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'dayIndicatorDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateDayIndicator = function (dayIndicator) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					dayIndicator: dayIndicator
				};
				reportActionCreators.updateActivity(activity, 'dayIndicator');
			};
		}
	};
});
