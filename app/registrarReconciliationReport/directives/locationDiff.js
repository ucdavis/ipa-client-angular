/**
 * example:
 * <location-diff></location-diff>
 */
registrarReconciliationReportApp.directive("locationDiff", this.locationDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'locationDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateBannerLocation = function (bannerLocation) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					bannerLocation: bannerLocation
				};
				reportActionCreators.updateActivity(activity, 'bannerLocation');
			};
		}
	};
});
