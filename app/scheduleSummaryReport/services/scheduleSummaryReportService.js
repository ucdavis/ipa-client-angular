/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportService
 * @description
 * # reportService
 * Service in the reportApp.
 * reportApp specific api calls.
 */
class ScheduleSummaryReportService {
	constructor(ApiService, $q, $http, $window) {
		var self = this;
		this.apiService = ApiService;
		return {
			getInitialState: function (workgroupId, year, termCode) {
				return self.apiService.get("/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + termCode);
			},
			downloadSchedule: function (workgroupId, year, shortTermCode) {
				var deferred = $q.defer();
	
				$http.get(window.serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + shortTermCode + "/generateExcel", { withCredentials: true })
					.then(function (payload) {
						$window.location.href = payload.data.redirect;
						deferred.resolve(payload.data);
					},
					function () {
						deferred.reject();
					});
	
				return deferred.promise;
			}
		};
	}
}

ScheduleSummaryReportService.$inject = ['ApiService', '$q', '$http', '$window'];

export default ScheduleSummaryReportService;