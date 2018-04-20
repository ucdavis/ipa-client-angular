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
		this.apiService = ApiService;
		return {
			getInitialState: function (workgroupId, year, termCode) {
				return apiService.get("/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + termCode);
			},
			downloadSchedule: function (workgroupId, year, shortTermCode) {
				return apiService.get("/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + shortTermCode + "/generateExcel");
			}
		};
	}
};

ScheduleSummaryReportService.$inject = ['ApiService'];

export default ScheduleSummaryReportService;