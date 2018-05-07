/**
 * example:
 * <location-diff></location-diff>
 */
let locationDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./locationDiff.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateBannerLocation = function (bannerLocation) {
				var activity = {
					id: scope.activity.id,
					typeCode: scope.activity.typeCode,
					bannerLocation: bannerLocation
				};
				RegistrarReconciliationReportActionCreators.updateActivity(activity, 'bannerLocation');
			};
		}
	};
};

export default locationDiff;
