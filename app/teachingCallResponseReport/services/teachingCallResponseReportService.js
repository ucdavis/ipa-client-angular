/**
 * @ngdoc service
 * @name teachingCallResponseReportApp.teachingCallResponseReportService
 * @description
 * # teachingCallResponseReportService
 * Service in the teachingCallResponseReportApp.
 * teachingCallResponseReportApp specific api calls.
 */
teachingCallResponseReportApp.factory("teachingCallResponseReportService", this.teachingCallResponseReportService = function ($http, $q, $window, apiService) {
	return {
		getInitialState: function (workgroupId, year) {
			return apiService.get("/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year);
		},
		download: function (workgroupId, year) {
			$http.get(serverRoot + "/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
			.then(function(payload) {
				$window.location.href = payload.redirect;
				deferred.resolve(payload);
			},
			function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
