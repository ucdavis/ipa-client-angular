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
		var self = this;
		this.apiService = ApiService;

		return {
			getSchedulesToCompare: function (workgroupId) {
				return self.apiService.get("/api/reportView/workgroups/" + workgroupId);
			},
			getTermComparisonReport: function (workgroupId, year, termCode) {
				return self.apiService.get("/api/reportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode);
			},
			updateSection: function (section) {
				return self.apiService.put("/api/reportView/sections/" + section.id, section);
			},
			createSection: function (section) {
				return self.apiService.post("/api/reportView/sectionGroups/" + section.sectionGroupId + "/sections/" + section.sequenceNumber, section);
			},
			updateActivity: function (activity) {
				return self.apiService.put("/api/reportView/activities/" + activity.id, activity);
			},
			deleteActivity: function (activity) {
				return self.apiService.delete("/api/reportView/activities/" + activity.id);
			},
			createActivity: function (sectionId, activity) {
				return self.apiService.post("/api/reportView/sections/" + sectionId + "/activities/" + activity.typeCode, activity);
			},
			assignInstructor: function (sectionGroupId, instructor) {
				return self.apiService.post("/api/reportView/sectionGroups/" + sectionGroupId + "/instructors", instructor);
			},
			unAssignInstructor: function (sectionGroupId, instructor) {
				return self.apiService.delete("/api/reportView/sectionGroups/" + sectionGroupId + "/instructors/" + instructor.loginId);
			},
			deleteSection: function (section) {
				return self.apiService.delete("/api/reportView/sections/" + section.id);
			},
			createSyncAction: function (syncAction) {
				return self.apiService.post("/api/reportView/syncActions", syncAction);
			},
			deleteSyncAction: function (syncActionId) {
				return self.apiService.delete("/api/reportView/syncActions/" + syncActionId);
			}
		};
	}
}

RegistrarReconciliationReportService.$inject = ['ApiService'];

export default RegistrarReconciliationReportService;
