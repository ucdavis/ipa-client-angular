/**
 * example:
 * <start-time-diff></start-time-diff>
 */
registrarReconciliationReportApp.directive("startTimeDiff", this.startTimeDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'startTimeDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateStartTime = function (startTime) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					startTime: moment(startTime, "HHmm").format("HH:mm:ss")
				};
				reportActionCreators.updateActivity(activity, 'startTime');
			};
		}
	};
});
