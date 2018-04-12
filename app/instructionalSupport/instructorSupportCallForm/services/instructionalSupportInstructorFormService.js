instructionalSupportApp.factory("instructionalSupportInstructorFormService", this.instructionalSupportInstructorFormService = function(apiService) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			return apiService.get("/api/instructionalSupportInstructorFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
		},
		addInstructorPreference: function(sectionGroupId, supportStaffId) {
			return apiService.post("/api/instructionalSupportInstructorFormView/sectionGroups/" + sectionGroupId + "/supportStaff/" + supportStaffId);
		},
		updateSupportCallResponse: function(supportCallResponse) {
			return apiService.put("/api/instructionalSupportInstructorFormView/instructorSupportCallResponses/" + supportCallResponse.id, supportCallResponse);
		},
		updatePreferencesOrder: function(preferenceIds, scheduleId, sectionGroupId) {
			return apiService.put("/api/instructionalSupportInstructorFormView/schedules/" + scheduleId + "/sectionGroups/" + sectionGroupId, preferenceIds);
		},
		deleteInstructorPreference: function(preferenceId) {
			return apiService.delete("/api/instructionalSupportInstructorFormView/instructorInstructionalSupportPreferences/" + preferenceId);
		}
	};
});
