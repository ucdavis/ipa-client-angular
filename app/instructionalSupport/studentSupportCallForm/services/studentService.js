instructionalSupportApp.factory("studentService", this.studentService = function(apiService) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			return apiService.get("/api/instructionalSupportStudentFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
		},
		addStudentPreference: function(sectionGroupId, type) {
			return apiService.post("/api/instructionalSupportStudentFormView/sectionGroups/" + sectionGroupId + "/preferenceType/" + type);
		},
		updateSupportCallResponse: function(supportCallResponse) {
			return apiService.put("/api/instructionalSupportStudentFormView/studentSupportCallResponses/" + supportCallResponse.id, supportCallResponse);
		},
		updatePreferencesOrder: function(preferenceIds, scheduleId, termCode) {
			return apiService.put("/api/instructionalSupportStudentFormView/schedules/" + scheduleId + "/terms/" + termCode, preferenceIds);
		},
		updatePreference: function(scheduleId, preference) {
			return apiService.put("/api/instructionalSupportStudentFormView/schedules/" + scheduleId + "/preferences/" + preference.id, preference);
		},
		deleteStudentPreference: function(preferenceId) {
			return apiService.delete("/api/instructionalSupportStudentFormView/studentInstructionalSupportPreferences/" + preferenceId);
		}
	};
});
