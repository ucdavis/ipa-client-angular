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
			downloadSchedule: function (workgroupId, year, shortTermCode, simpleView) {
				var deferred = $q.defer();
				let endpoint;

				if (simpleView) {
					endpoint = window.serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel/simpleView";
				} else if (shortTermCode){
					endpoint = window.serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + shortTermCode + "/generateExcel";
				} else {
					endpoint = window.serverRoot + "/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel";
				}
				$http.get(endpoint, { withCredentials: true })
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