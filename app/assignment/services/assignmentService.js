/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
class AssignmentService {
	constructor (ApiService) {
		var self = this;
		this.apiService = ApiService;
		return {
			getInitialState: function(workgroupId, year) {
				return self.apiService.get("/api/assignmentView/" + workgroupId + "/" + year);
			},
			download: function (workgroupId, year) {
				return self.apiService.get("/api/assignmentView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel");
			},
			updateSectionGroup: function (sectionGroup) {
				return self.apiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
			},
			createTeachingCall: function (workgroupId, year, teachingCallConfig) {
				return self.apiService.post("/api/assignmentView/" + workgroupId + "/" + year + "/teachingCalls", teachingCallConfig);
			},
			addPreference: function (teachingAssignment) {
				return self.apiService.post("/api/assignmentView/preferences/" + teachingAssignment.schedule.id, teachingAssignment);
			},
			removePreference: function (teachingAssignment) {
				return self.apiService.delete("/api/assignmentView/preferences/" + teachingAssignment.id);
			},
			deleteTeachingCall: function (teachingCall) {
				return self.apiService.delete("/api/assignmentView/teachingCalls/" + teachingCall.id);
			},
			addInstructorAssignment: function (teachingAssignment, scheduleId) {
				teachingAssignment.termCode = String(teachingAssignment.termCode);
	
				return self.apiService.post("/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments", teachingAssignment);
			},
			updateInstructorAssignment: function (teachingAssignment) {
				return self.apiService.put("/api/assignmentView/teachingAssignments/" + teachingAssignment.id, teachingAssignment);
			},
			addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
				var scheduleInstructorNote = {};
				scheduleInstructorNote.instructorComment = comment;
				scheduleInstructorNote.assignmentsCompleted = assignmentsCompleted;
	
				return self.apiService.post("/api/assignmentView/scheduleInstructorNotes/" + instructorId + "/" + workgroupId + "/" + year, scheduleInstructorNote);
			},
			assignStudentToAssociateInstructor: function (sectionGroupId, supportStaffId) {
				return self.apiService.post("/api/assignmentView/sectionGroups/" + sectionGroupId + "/supportStaff/" + supportStaffId + "/assignAI");
			},
			updateScheduleInstructorNote: function (scheduleInstructorNote) {
				return self.apiService.put("/api/assignmentView/scheduleInstructorNotes/" + scheduleInstructorNote.id, scheduleInstructorNote);
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
				return self.apiService.put("/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments" , sortedTeachingAssignmentIds);
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				return self.apiService.put("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.id, teachingCallResponse);
			},
			addTeachingCallResponse: function (teachingCallResponse) {
				return self.apiService.post("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.scheduleId  + "/" + teachingCallResponse.instructorId, teachingCallResponse);
			},
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				return self.apiService.put("/api/assignmentView/teachingCallReceipts/" + teachingCallReceipt.id, teachingCallReceipt);
			},
			searchCourses: function(query) {
				return self.apiService.get("/courses/search?q=" + query + "&token=" + dwToken, null, dwUrl);
			},
			allTerms: function () {
				var allTerms = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};
	
				return allTerms;
			}
		};
	}
}

AssignmentService.$inject = ['ApiService'];

export default AssignmentService;
