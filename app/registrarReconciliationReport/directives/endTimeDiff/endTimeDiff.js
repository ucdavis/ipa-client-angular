/**
 * example:
 * <end-time-diff></end-time-diff>
 */
let endTimeDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./endTimeDiff.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateEndTime = function (endTime) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					endTime: moment(endTime, "HHmm").format("HH:mm:ss")
				};
				RegistrarReconciliationReportActionCreators.updateActivity(activity, 'endTime');
			};
		}
	};
};

export default endTimeDiff;
