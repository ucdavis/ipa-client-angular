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

			$http.get(serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + termCode, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		downloadSchedule: function (workgroupId, year, shortTermCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + shortTermCode + "/generateExcel", { withCredentials: true })
				.success(function (payload) {
					$window.location.href = payload.redirect;
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		}
	};
});
