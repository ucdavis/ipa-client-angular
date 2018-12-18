class TeachingCallFormService {
	constructor (ApiService) {
		return {
			getInitialState: function(workgroupId, year) {
				return ApiService.get("/api/teachingCallView/" + workgroupId + "/" + year + "/teachingCallForm");
			},
			addPreference: function (teachingAssignment) {
				return ApiService.post("/api/assignmentView/preferences/" + teachingAssignment.scheduleId, teachingAssignment);
			},
			updateTeachingAssignment: function (teachingAssignment) {
				return ApiService.put("/api/teachingAssignments/" + teachingAssignment.id, teachingAssignment);
			},
			removePreference: function (teachingAssignment) {
				return ApiService.delete("/api/assignmentView/preferences/" + teachingAssignment.id);
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
				return ApiService.put("/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments" , sortedTeachingAssignmentIds);
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				return ApiService.put("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.id, teachingCallResponse);
			},
			createAvailability: function (teachingCallResponse) {
				return ApiService.post("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.scheduleId  + "/" + teachingCallResponse.instructorId, teachingCallResponse);
			},
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				return ApiService.put("/api/assignmentView/teachingCallReceipts/" + teachingCallReceipt.id, teachingCallReceipt);
			},
			searchDWCourses: function (query) {
				return ApiService.get('/courses/search?q=' + query + '&token=' + dwToken, null, dwUrl);
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

export default TeachingCallFormService;
