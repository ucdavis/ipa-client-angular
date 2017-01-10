/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportService
 * @description
 * # reportService
 * Service in the reportApp.
 * reportApp specific api calls.
 */
scheduleSummaryReportApp.factory("scheduleSummaryReportService", this.scheduleSummaryReportService = function ($http, $q, $window) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		}
	};
});
