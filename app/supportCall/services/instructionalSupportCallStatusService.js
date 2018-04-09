supportCallApp.factory("instructionalSupportCallStatusService", this.instructionalSupportAssignmentService = function(apiService) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			return apiService.get("/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year +"/" + termShortCode + "/supportCallStatus");
		},
		addStudentsSupportCall: function(scheduleId, studentSupportCall) {
			return apiService.post("/api/supportCallView/" + scheduleId + "/addStudents", studentSupportCall);
		},
		addInstructorsSupportCall: function(scheduleId, instructorSupportCall) {
			return apiService.post("/api/supportCallView/" + scheduleId + "/addInstructors", instructorSupportCall);
		},
		contactInstructorsSupportCall: function(scheduleId, supportCallData) {
			return apiService.put("/api/supportCallView/" + scheduleId + "/contactInstructors", supportCallData);
		},
		contactSupportStaffSupportCall: function(scheduleId, supportCallData) {
			return apiService.put("/api/supportCallView/" + scheduleId + "/contactSupportStaff", supportCallData);
		},
		removeInstructorFromSupportCall: function(instructor, scheduleId, termCode) {
			return apiService.delete("/api/supportCallView/schedules/" + scheduleId + "/instructorSupportCallResponses/" + instructor.supportCallResponseId);
		},
		removeStudentFromSupportCall: function(student, scheduleId, termCode) {
			return apiService.delete("/api/supportCallView/schedules/" + scheduleId + "/studentSupportCallResponses/" + student.supportCallResponseId);
		}
	};
});
