class InstructorFormService {
	constructor (ApiService) {
		return {
			getInitialState: function(workgroupId, year, termShortCode) {
				return ApiService.get("/api/instructionalSupportInstructorFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
			},
			addInstructorPreference: function(sectionGroupId, supportStaffId) {
				return ApiService.post("/api/instructionalSupportInstructorFormView/sectionGroups/" + sectionGroupId + "/supportStaff/" + supportStaffId);
			},
			updateSupportCallResponse: function(instructorSupportCallResponse) {
				return ApiService.put("/api/instructionalSupportInstructorFormView/instructorSupportCallResponses/" + instructorSupportCallResponse.id, instructorSupportCallResponse);
			},
			updatePreferencesOrder: function(preferenceIds, scheduleId, sectionGroupId) {
				return ApiService.put("/api/instructionalSupportInstructorFormView/schedules/" + scheduleId + "/sectionGroups/" + sectionGroupId, preferenceIds);
			},
			deleteInstructorPreference: function(preferenceId) {
				return ApiService.delete("/api/instructionalSupportInstructorFormView/instructorInstructionalSupportPreferences/" + preferenceId);
			}
		};
	}
}

InstructorFormService.$inject = ['ApiService'];

export default InstructorFormService;
