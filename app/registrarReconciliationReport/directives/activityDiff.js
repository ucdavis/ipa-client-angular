/**
 * example:
 * <activity-diff></activity-diff>
 */
registrarReconciliationReportApp.directive("activityDiff", this.activityDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'activityDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.deleteActivity = function (activity) {
				reportActionCreators.deleteActivity(activity);
			};
			scope.createActivity = function (section, activityIndex) {
				reportActionCreators.createActivity(section, activityIndex);
			};
		}
	};
});
