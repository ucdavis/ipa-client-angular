/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportService
 * @description
 * # reportService
 * Service in the reportApp.
 * reportApp specific api calls.
 */
class ScheduleSummaryReportService {
	constructor(apiService) {
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

ScheduleSummaryReportService.$inject = ['apiService'];

export default ScheduleSummaryReportService;