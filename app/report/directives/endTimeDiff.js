/**
 * example:
 * <end-time-diff></end-time-diff>
 */
reportApp.directive("endTimeDiff", this.endTimeDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'endTimeDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateEndTime = function (endTime) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					endTime: moment(endTime, "HHmm").format("HH:mm:ss")
				};
				reportActionCreators.updateActivity(activity, 'endTime');
			};
		}
	};
});
