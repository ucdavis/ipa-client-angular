/**
 * example:
 * <activity-diff></activity-diff>
 */
let activityDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./activityDiff.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.deleteActivity = function (activity) {
				RegistrarReconciliationReportActionCreators.deleteActivity(activity);
			};
			scope.createActivity = function (section, activityIndex) {
				RegistrarReconciliationReportActionCreators.createActivity(section, activityIndex);
			};
		}
	};
};

export default activityDiff;