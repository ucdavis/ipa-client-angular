/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.RegistrarReconciliationReportService
 * @description
 * # RegistrarReconciliationReportService
 * Service in the reportApp.
 * reportApp specific api calls.
 */
class RegistrarReconciliationReportService {
	constructor (ApiService) {
		this.apiService = ApiService;

		return {
			getSchedulesToCompare: function (workgroupId) {
				return apiService.get("/api/reportView/workgroups/" + workgroupId);
			},
			getTermComparisonReport: function (workgroupId, year, termCode) {
				return apiService.get("/api/reportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode);
			},
			updateSection: function (section) {
				return apiService.put("/api/reportView/sections/" + section.id, section);
			},
			createSection: function (section) {
				return apiService.post("/api/reportView/sectionGroups/" + section.sectionGroupId + "/sections/" + section.sequenceNumber, section);
			},
			updateActivity: function (activity) {
				return apiService.put("/api/reportView/activities/" + activity.id, activity);
			},
			deleteActivity: function (activity) {
				return apiService.delete("/api/reportView/activities/" + activity.id);
			},
			createActivity: function (sectionId, activity) {
				return apiService.post("/api/reportView/sections/" + sectionId + "/activities/" + activity.typeCode, activity);
			},
			assignInstructor: function (sectionGroupId, instructor) {
				return apiService.post("/api/reportView/sectionGroups/" + sectionGroupId + "/instructors", instructor);
			},
			unAssignInstructor: function (sectionGroupId, instructor) {
				return apiService.delete("/api/reportView/sectionGroups/" + sectionGroupId + "/instructors/" + instructor.loginId);
			},
			deleteSection: function (section) {
				return apiService.delete("/api/reportView/sections/" + section.id);
			},
			createSyncAction: function (syncAction) {
				return apiService.post("/api/reportView/syncActions", syncAction);
			},
			deleteSyncAction: function (syncActionId) {
				return apiService.delete("/api/reportView/syncActions/" + syncActionId);
			}
		};
	}
}

RegistrarReconciliationReportService.$inject = ['ApiService'];

export default RegistrarReconciliationReportService;
