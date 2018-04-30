class StudentFormService {
	constructor (ApiService) {
		return {
			getInitialState: function(workgroupId, year, termShortCode) {
				return ApiService.get("/api/instructionalSupportStudentFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
			},
			addStudentPreference: function(sectionGroupId, type) {
				return ApiService.post("/api/instructionalSupportStudentFormView/sectionGroups/" + sectionGroupId + "/preferenceType/" + type);
			},
			updateSupportCallResponse: function(supportCallResponse) {
				return ApiService.put("/api/instructionalSupportStudentFormView/studentSupportCallResponses/" + supportCallResponse.id, supportCallResponse);
			},
			updatePreferencesOrder: function(preferenceIds, scheduleId, termCode) {
				return ApiService.put("/api/instructionalSupportStudentFormView/schedules/" + scheduleId + "/terms/" + termCode, preferenceIds);
			},
			updatePreference: function(scheduleId, preference) {
				return ApiService.put("/api/instructionalSupportStudentFormView/schedules/" + scheduleId + "/preferences/" + preference.id, preference);
			},
			deleteStudentPreference: function(preferenceId) {
				return ApiService.delete("/api/instructionalSupportStudentFormView/studentInstructionalSupportPreferences/" + preferenceId);
			}
		};
	}
}

StudentFormService.$inject = ['ApiService'];

export default StudentFormService;
