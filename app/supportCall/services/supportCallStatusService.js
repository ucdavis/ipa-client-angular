class SupportCallStatusService {
	constructor (ApiService) {
		var self = this;
		this.ApiService = ApiService;

		return {
			getInitialState: function(workgroupId, year, termShortCode) {
				return self.ApiService.get("/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year +"/" + termShortCode + "/supportCallStatus");
			},
			addStudentsSupportCall: function(scheduleId, studentSupportCall) {
				return self.ApiService.post("/api/supportCallView/" + scheduleId + "/addStudents", studentSupportCall);
			},
			addInstructorsSupportCall: function(scheduleId, instructorSupportCall) {
				return self.ApiService.post("/api/supportCallView/" + scheduleId + "/addInstructors", instructorSupportCall);
			},
			contactInstructorsSupportCall: function(scheduleId, supportCallData) {
				return self.ApiService.put("/api/supportCallView/" + scheduleId + "/contactInstructors", supportCallData);
			},
			contactSupportStaffSupportCall: function(scheduleId, supportCallData) {
				return self.ApiService.put("/api/supportCallView/" + scheduleId + "/contactSupportStaff", supportCallData);
			},
			removeInstructorFromSupportCall: function(instructor, scheduleId) {
				return self.ApiService.delete("/api/supportCallView/schedules/" + scheduleId + "/instructorSupportCallResponses/" + instructor.supportCallResponseId);
			},
			removeStudentFromSupportCall: function(student, scheduleId) {
				return self.ApiService.delete("/api/supportCallView/schedules/" + scheduleId + "/studentSupportCallResponses/" + student.supportCallResponseId);
			}
		};
	}
}

SupportCallStatusService.$inject = ['ApiService'];

export default SupportCallStatusService;
