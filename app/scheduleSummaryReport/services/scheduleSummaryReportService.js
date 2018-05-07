/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportService
 * @description
 * # reportService
 * Service in the reportApp.
 * reportApp specific api calls.
 */
class ScheduleSummaryReportService {
	constructor(ApiService) {
		var self = this;
		this.apiService = ApiService;
		return {
			getInitialState: function (workgroupId, year, termCode) {
				return self.apiService.get("/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + termCode);
			},
			downloadSchedule: function (workgroupId, year, shortTermCode) {
				return self.apiService.get("/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + shortTermCode + "/generateExcel");
			}
		};
	}
}

ScheduleSummaryReportService.$inject = ['ApiService'];

export default ScheduleSummaryReportService;