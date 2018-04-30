class InstructorFormService {
	constructor (ApiService) {
		let _self = this;

		return {
			getInitialState: function(workgroupId, year, termShortCode) {
				return _self.ApiService.get("/api/instructionalSupportInstructorFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
			},
			addInstructorPreference: function(sectionGroupId, supportStaffId) {
				return _self.ApiService.post("/api/instructionalSupportInstructorFormView/sectionGroups/" + sectionGroupId + "/supportStaff/" + supportStaffId);
			},
			updateSupportCallResponse: function(supportCallResponse) {
				return _self.ApiService.put("/api/instructionalSupportInstructorFormView/instructorSupportCallResponses/" + supportCallResponse.id, supportCallResponse);
			},
			updatePreferencesOrder: function(preferenceIds, scheduleId, sectionGroupId) {
				return _self.ApiService.put("/api/instructionalSupportInstructorFormView/schedules/" + scheduleId + "/sectionGroups/" + sectionGroupId, preferenceIds);
			},
			deleteInstructorPreference: function(preferenceId) {
				return _self.ApiService.delete("/api/instructionalSupportInstructorFormView/instructorInstructionalSupportPreferences/" + preferenceId);
			}
		};
	}
}

InstructorFormService.$inject = ['ApiService'];

export default InstructorFormService;
