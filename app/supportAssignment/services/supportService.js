class SupportService {
	constructor (ApiService) {
		return {
			getInitialState: function(workgroupId, year, termShortCode) {
				return ApiService.get("/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
			},
			deleteAssignment: function(supportAssignment) {
				return ApiService.delete("/api/instructionalSupportView/instructionalSupportAssignments/" + supportAssignment.id);
			},
			assignStaffToSectionGroup: function(sectionGroupId, supportStaffId, type) {
				return ApiService.post("/api/instructionalSupportView/sectionGroups/" + sectionGroupId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId);
			},
			assignStaffToSection: function(sectionId, supportStaffId, type) {
				return ApiService.post("/api/instructionalSupportView/sections/" + sectionId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId);
			},
			toggleSupportStaffSupportCallReview: function(scheduleId, termShortCode) {
				return ApiService.put("/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleSupportStaffSupportCallReview");
			},
			toggleInstructorSupportCallReview: function(scheduleId, termShortCode) {
				return ApiService.put("/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleInstructorSupportCallReview");
			},
			updateSupportAppointment: function (supportAppointment) {
				return ApiService.put("/api/instructionalSupportView/schedules/" + supportAppointment.scheduleId, supportAppointment);
			},
			updateSectionGroup: function (sectionGroup) {
				return ApiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
			}
		};
	
	}
}

SupportService.$inject = ['ApiService'];

export default SupportService;
