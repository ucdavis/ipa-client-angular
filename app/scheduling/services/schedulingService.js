'use strict';

/**
 * @ngdoc service
 * @name schedulingApp.schedulingService
 * @description
 * # schedulingService
 * Service in the schedulingApp.
 * schedulingApp specific api calls.
 */
schedulingApp.factory("schedulingService", this.schedulingService = function($http, $q) {
	return {
		getScheduleByWorkgroupIdAndYearAndTermCode: function (workgroupId, year, termShortCode) {
			var deferred = $q.defer();
			var termCode = year + termShortCode;

			$http.get(serverRoot + "/api/schedulingView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
