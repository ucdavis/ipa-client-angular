teachingCallApp.factory("teachingCallFormService", this.teachingCallFormService = function(apiService) {
	return {
		getInitialState: function(workgroupId, year) {
			return apiService.get("/api/teachingCallView/" + workgroupId + "/" + year + "/teachingCallForm");
		},
		addPreference: function (teachingAssignment) {
			return apiService.post("/api/assignmentView/preferences/" + teachingAssignment.scheduleId, teachingAssignment);
		},
		removePreference: function (teachingAssignment) {
			return apiService.delete("/api/assignmentView/preferences/" + teachingAssignment.id);
		},
		updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
			return apiService.put("/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments" , sortedTeachingAssignmentIds);
		},
		updateTeachingCallResponse: function (teachingCallResponse) {
			return apiService.put("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.id, teachingCallResponse);
		},
		createAvailability: function (teachingCallResponse) {
			return apiService.post("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.scheduleId  + "/" + teachingCallResponse.instructorId, teachingCallResponse);
		},
		updateTeachingCallReceipt: function (teachingCallReceipt) {
			return apiService.put("/api/assignmentView/teachingCallReceipts/" + teachingCallReceipt.id, teachingCallReceipt);
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
});
