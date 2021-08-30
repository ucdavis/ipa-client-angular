/**
 * example:
 * <start-time-diff></start-time-diff>
 */
let startTimeDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./startTimeDiff.html'),
		replace: true,
		link: function (scope) {
			scope.updateStartTime = function (startTime) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					startTime: startTime !== null ? moment(startTime, "HHmm").format("HH:mm:ss") : null // eslint-disable-line no-undef
				};
				RegistrarReconciliationReportActionCreators.updateActivity(activity, 'startTime');
			};
		}
	};
};

export default startTimeDiff;
