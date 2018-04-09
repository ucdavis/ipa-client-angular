supportAssignmentApp.factory("supportService", this.supportService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			return apiService.get("/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
		},
		deleteAssignment: function(supportAssignment) {
			return apiService.delete("/api/instructionalSupportView/instructionalSupportAssignments/" + supportAssignment.id);
		},
		assignStaffToSectionGroup: function(sectionGroupId, supportStaffId, type) {
			return apiService.post("/api/instructionalSupportView/sectionGroups/" + sectionGroupId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId);
		},
		assignStaffToSection: function(sectionId, supportStaffId, type) {
			return apiService.post("/api/instructionalSupportView/sections/" + sectionId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId);
		},
		toggleSupportStaffSupportCallReview: function(scheduleId, termShortCode) {
			return apiService.put("/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleSupportStaffSupportCallReview");
		},
		toggleInstructorSupportCallReview: function(scheduleId, termShortCode) {
			return apiService.put("/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleInstructorSupportCallReview");
		},
		updateSupportAppointment: function (supportAppointment) {
			return apiService.put("/api/instructionalSupportView/schedules/" + supportAppointment.scheduleId, supportAppointment);
		},
		updateSectionGroup: function (sectionGroup) {
			return apiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
		}
	};
});
